import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  // console.log("The API KEY OPN IS " ,process.env.OPEN_AI_API_KEY )
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    const result = await response.json();
    // return result.data[0].embedding as number[];
    if (result && result.data) {
      return result.data[0].embedding as number[];
    } else {
      console.log("Expected properties not found in API response:", result);
      return;
    }
  } catch (error) {
    console.log("Error calling openai embeddings api", error);
    throw error;
  }
}
