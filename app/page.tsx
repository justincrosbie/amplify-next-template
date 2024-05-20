"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

import { ThemeProvider } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { LivenessQuickStartReact } from "./components/Liveness";

Amplify.configure(outputs);
const existingConfig = Amplify.getConfig();
Amplify.configure({
  ...existingConfig,
  // API: {
  //   REST: outputs.custom.API,
  // },
});
const client = generateClient<Schema>();

export default function App() {
  return (
    <ThemeProvider>
      <LivenessQuickStartReact />
    </ThemeProvider>
  );
}