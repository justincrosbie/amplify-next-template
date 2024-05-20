import { defineFunction } from '@aws-amplify/backend';

export const livenessGetResults = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'liveness-get-results',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts'
});