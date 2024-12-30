import { createCookieSessionStorage, redirect } from "@remix-run/node";
import "dotenv/config";
import { userLogout } from "~/firebase/auth";
import { adminAuth } from "~/firebase/firebase.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set!");
}

// Create a cookie session storage
const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
});

// Get a session token
async function getSessionToken(tokenId: string) {
  const decodedToken = await adminAuth.verifyIdToken(tokenId);
  if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
    throw new Error("Recent sign in required");
  }
  const twoWeeks = 60 * 60 * 24 * 14 * 1000;
  return adminAuth.createSessionCookie(tokenId, { expiresIn: twoWeeks });
}

// Create a user session
export async function createUserSession(tokenId: string, redirectTo: string) {
  const token = await getSessionToken(tokenId);
  const session = await storage.getSession();

  session.set("token", token);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}

// Get a user session
export async function getUserSession(request: Request) {
  const cookieSession = await storage.getSession(request.headers.get("Cookie"));
  const token = cookieSession.get("token");
  if (!token) return null;

  try {
    const tokenUser = await adminAuth.verifySessionCookie(token, true);
    return tokenUser;
  } catch (error) {
    return null;
  }
}

// Get a current user
export async function getCurrentUser(request: Request) {
  const cookieSession = await storage.getSession(request.headers.get("Cookie"));
  const token = cookieSession.get("token");
  if (!token) return null;

  try {
    const decodedToken = await adminAuth.verifySessionCookie(token);
    const { email, uid: userId, name } = decodedToken;
    return { email, userId, name };
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return null;
  }
}

// Destroy a user session
export async function destroyUserSession(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const newCookie = await storage.destroySession(session);

  return redirect("/login", { headers: { "Set-Cookie": newCookie } });
}

// Sign out a user
export async function userSignOut(request: Request) {
  await userLogout();
  return await destroyUserSession(request);
}
