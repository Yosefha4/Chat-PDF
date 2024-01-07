import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
    console.log("AWS_ACCESS_KEY_ID:", process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID);
    console.log("AWS_SECRET_KEY:", process.env.NEXT_PUBLIC_AWS_SECRET_KEY);
    console.log("All environment variables:", process.env);

  return new Promise((resolve, reject) => {
    try {

      const s3 = new S3({
        region: "eu-west-3",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY!,
        },
      });

      const file_key =
        "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

      const params = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      };
      s3.putObject(
        params,
        (err: any, data: PutObjectCommandOutput | undefined) => {
          if (err) {
            console.error("S3 Upload Error:", err);
            console.log("Complete Error Object:", err); // Log the complete error object
            console.log("S3 Request Headers:", err.request.headers); // Log request headers
            console.log("S3 Request Endpoint:", err.request.endpoint); // Log request endpoint

            reject(err);
          } else {
            console.log("S3 Upload Success:", data);
            resolve({
              file_key,
              file_name: file.name,
            });
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

export function getS3Url(file_key: string) {
  const url = `http://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-west-3.amazonaws.com/${file_key}`;
  return url;
}

