"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

import '@aws-amplify/ui-react/styles.css'
import GoogleAnalytics from "./components/GoogleAnalytics";
import { Typography } from "@material-tailwind/react";
import WebcamArea from "./components/WebCamArea";
import { DisclaimerDialog } from "./components/DisclaimerDialog";

Amplify.configure(outputs);
const existingConfig = Amplify.getConfig();
Amplify.configure({
  ...existingConfig,
  API: {
    REST: outputs.custom.API,
  },
});

// Amplify.configure({
//   ...existingConfig,
//   API: {
//     ...existingConfig.API,
//     REST: {
//       ...existingConfig.API?.REST,
//       YourAPIName: {
//         endpoint:
//           'https://76xq8826sk.execute-api.us-east-1.amazonaws.com/prod/api-function',
//         region: 'us-east-1' // Optional
//       }
//     }
//   }
// });

const client = generateClient<Schema>();

export default function App() {

  return (    
    <div className="w-full h-full" >

      <div
        className="w-full flex flex-col justify-center items-center p-4"
      >
        <div className="flex flex-col items-center justify-center gap-6">
          <Typography className="w-full flex flex-col justify-center items-center p-5" variant="h5" color="blue-gray">
            Anonymous Age Verification
          </Typography>
        </div>
        <DisclaimerDialog/>
        <WebcamArea/>

        <br/>
        <footer className="w-full bg-transparent p-2">
          <div className="flex flex-row flex-wrap items-center justify-center gap-x-12 bg-transparent text-center md:justify-between">
            <img src="./govlogo.png" alt="logo-ct" className="w-10" />
            <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
              <li>
                <Typography
                  as="a"
                  href="#"
                  color="blue-gray"
                  className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
                >
                  Audited service of the Australian Privacy Advocacy
                </Typography>
              </li>
            </ul>
          </div>
        </footer>   
      </div>

      <GoogleAnalytics />
    </div>
  );
}