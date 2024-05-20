"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { LivenessQuickStartReact } from "./components/Liveness";
import { Component } from "react";

Amplify.configure(outputs);
const existingConfig = Amplify.getConfig();
Amplify.configure({
  ...existingConfig,
  API: {
    REST: outputs.custom.API,
  },
});


Amplify.configure({
  ...existingConfig,
  API: {
    ...existingConfig.API,
    REST: {
      ...existingConfig.API?.REST,
      YourAPIName: {
        endpoint:
          'https://76xq8826sk.execute-api.us-east-1.amazonaws.com/prod/api-function',
        region: 'us-east-1' // Optional
      }
    }
  }
});

const client = generateClient<Schema>();

export default function App() {
  return (    
    <ThemeProvider>
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user?.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>

      <LivenessQuickStartReact />
    </ThemeProvider>
  );
}