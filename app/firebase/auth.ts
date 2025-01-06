import "dotenv/config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { getAuthError } from "~/firebase/auth.errors";
import { LoginResult } from "~/types";
import { clientApp } from "./firebase.server";

// Initialize firebase client app configuration
export async function getClientAuth() {
  const clientAuth = getAuth(clientApp);
  return clientAuth;
}

// User registration function
export async function userRegister(
  name: string,
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const auth = await getClientAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();

    // Update user profile
    await updateProfile(user, { displayName: name });

    // Verify user email
    await sendEmailVerification(user);

    return {
      user: {
        userId: user.uid,
        name: user.displayName || name,
        email: user.email!,
        verified: user.emailVerified,
        token: String(token)
      }
    };
  } catch (error: any) {
    return {
      error: getAuthError(error.message)
    };
  }
}

// user login function
export async function userLogin(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const auth = await getClientAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;
    const token = await user.getIdToken();

    // Verify user email
    if (!user.emailVerified) {
      await sendEmailVerification(user);
    }

    return {
      user: {
        userId: user.uid,
        name: user.displayName || "",
        email: user.email!,
        verified: user.emailVerified,
        token: String(token)
      }
    };
  } catch (error: any) {
    return {
      error: getAuthError(error.message)
    };
  }
}

// user logout function
export async function userLogout() {
  await signOut(getAuth(clientApp));
}
