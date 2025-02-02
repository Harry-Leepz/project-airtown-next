"use server";

import { logInFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

/*
 * Authentication Actions:
 *
 * This module provides server-side authentication functions for logging in and logging out users.
 *
 * - `logInWithCredentials`: Handles user login using email and password.
 *   - Validates form data using `logInFormSchema`.
 *   - Attempts to authenticate the user via `signIn("credentials", user)`.
 *   - Returns a success message if authentication is successful.
 *   - If authentication fails, an error message is returned.
 *   - Redirect errors are handled explicitly.
 *
 * - `logOutUser`: Handles user logout by calling `signOut()`.
 *   - Ends the user session and logs them out.
 *   - Does not return any data.
 *
 * Usage:
 * These functions are intended to be used in a server-side environment with Next.js authentication flows.
 */

// log in users with credentials
export async function logInWithCredentials(
  previousState: unknown,
  formData: FormData
) {
  try {
    const user = logInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return {
      success: true,
      message: "Logged In Successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "Invalid Email or Password",
    };
  }
}

// log out user
export async function logOutUser() {
  await signOut();
}
