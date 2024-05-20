import { defineAuth } from "@aws-amplify/backend";
import { myApiFunction } from "../functions/api-function/resource";

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  access: (allow) => [
    allow.resource(myApiFunction).to(["addUserToGroup"])
  ],
});
