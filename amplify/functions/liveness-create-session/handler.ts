
import type { APIGatewayProxyHandler } from "aws-lambda";

import { Rekognition } from "@aws-sdk/client-rekognition";

// const Rekognition = require("aws-sdk/clients/rekognition");

const rekognitionClient = new Rekognition({ region: "us-east-1" });


export const handler: APIGatewayProxyHandler = async (event) => {
    console.log("event", event);

    const sessionId = await createSession();

    return {
      statusCode: 200,
      // Modify the CORS settings below to match your specific requirements
      headers: {
        "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
        "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
      },
      body: JSON.stringify({ sessionId }),
    };
  };

async function createSession() {
    const response = await rekognitionClient.createFaceLivenessSession();

    const sessionId = response.SessionId;
    console.log("SessionId:", sessionId);

    return sessionId;
}
