import type { APIGatewayProxyHandler } from "aws-lambda";

// const Rekognition = require("aws-sdk/clients/rekognition");

import { Rekognition } from "@aws-sdk/client-rekognition";

const rekognitionClient = new Rekognition({ region: "us-east-1" });

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log("event", event);


  const sessionId = event.pathParameters?.sessionId;

  if (!sessionId) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ message: "sessionId is required" }),
    };
  }

  const result = await getSessionResults(sessionId);

  return {
    statusCode: 200,
    // Modify the CORS settings below to match your specific requirements
    headers: {
      "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
      "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
    },
    body: JSON.stringify({ result }),
  };
};

async function getSessionResults(sessionId: string) {
    const response = await rekognitionClient
        .getFaceLivenessSessionResults({
            SessionId: sessionId,
        });

    const confidence = response.Confidence;
    const status = response.Status;
    console.log("Confidence:", confidence);
    console.log("Status:", status);

    return { status, confidence };
}
