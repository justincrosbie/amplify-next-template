import { defineFunction } from '@aws-amplify/backend';

export const livenessCreateSession = defineFunction({
  // optionally specify a name for the Function (defaults to directory name)
  name: 'liveness-create-session',
  // optionally specify a path to your handler (defaults to "./handler.ts")
  entry: './handler.ts'
});