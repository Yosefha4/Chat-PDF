import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import md5 from "md5";
import { convertToAscii } from "./utils";

export const getPineconeClient = async () => {
  return new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECONE_API_KEY,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: { loc: { pageNumber: number } };
};

export async function loadS3IntoPinecone(file_key: string) {
  //1. Obtain the pdf -> download and read from pdf
  console.log("downloading s3 into file system");
  const fileName = await downloadFromS3(file_key);

  if (!fileName) {
    throw new Error("could not download from s3");
  }

  const loader = new PDFLoader(fileName);
  const pages = (await loader.load()) as PDFPage[];

  //2. Split and segment the pdf
  const documents = await Promise.all(pages.map(prepareDocument));

  //3. Vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));

  //4. Upload to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = client.Index("chat-pdf-ai");

  const namespace = pineconeIndex.namespace(convertToAscii(file_key));

  console.log("inserting vectors into pinecone");
  await namespace.upsert(vectors);

  return documents[0];

}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding documents", error);
    throw error;
  }
}

export const convertStringToBytes = (str: string, bytes: number) => {
  const result = new TextEncoder();
  return new TextDecoder("utf-8").decode(result.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");

  //split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: convertStringToBytes(pageContent, 38000),
      },
    }),
  ]);

  return docs;
}
