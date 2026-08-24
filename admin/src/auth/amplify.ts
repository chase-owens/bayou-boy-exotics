import { Amplify } from "aws-amplify";

let isConfigured = false;

export function configureAmplify() {
  if (isConfigured) return;

  const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
  const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;

  if (!userPoolId || !userPoolClientId) {
    throw new Error("Missing Cognito configuration");
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
      },
    },
  });

  isConfigured = true;
}
