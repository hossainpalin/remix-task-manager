import { AuthErrorCodes } from "~/types";

export function getAuthError(errorMessage: string): AuthErrorCodes {
  const mappingError: { [key: string]: AuthErrorCodes } = {
    "Firebase: Error (auth/email-change-needs-verification).":
      AuthErrorCodes.EMAIL_CHANGE_NEEDS_VERIFICATION,
    "Firebase: Error (auth/email-already-in-use).": AuthErrorCodes.EMAIL_EXISTS,
    "Firebase: Error (auth/invalid-email).": AuthErrorCodes.INVALID_EMAIL,
    "Firebase: Error (auth/wrong-password).": AuthErrorCodes.INVALID_PASSWORD,
    "Firebase: Error (auth/too-many-requests).":
      AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER,
    "Firebase: Error (auth/weak-password).": AuthErrorCodes.WEAK_PASSWORD,
    "Firebase: Error (auth/invalid-credential).":
      AuthErrorCodes.INVALID_LOGIN_CREDENTIALS,
    "Firebase: Error (auth/network-request-failed).":
      AuthErrorCodes.NETWORK_ERROR
  };

  return mappingError[errorMessage] || errorMessage;
}
