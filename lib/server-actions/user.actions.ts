"use server";

import {
  logInFormSchema,
  shippingAddressSchema,
  signUpFormSchema,
  paymentMethodSchema,
  updateUserProfileSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/sample-data/prisma";

import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { z } from "zod";

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
 *  - `signUpUser`: Handles user registration and authentication.
 *   - Validates form data using `signUpFormSchema`.
 *   - Hashes the user's password before storing it securely in the database.
 *   - Creates a new user record in the database using Prisma.
 *   - Automatically logs in the newly registered user via `signIn("credentials")`.
 *   - Returns a success message if registration is successful.
 *   - If registration fails, an error message is returned.
 *   - Redirect errors are handled explicitly.
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

// user accoung sign up
export async function signUpUser(previousState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      name: formData.get("name"),
    });

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: formData.get("password"),
    });

    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: formatError(error),
    };
  }
}

// get user by id
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User was not found");
  }

  return user;
}

// update user address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    // get current user from session and validate data against zod schema and update db
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address },
    });

    return {
      success: true,
      message: "User address details updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// update user payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    // get current user from session and validate data against zod schema and update db
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: "User payment method updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// update user profile
export async function updateUserProfile(
  user: z.infer<typeof updateUserProfileSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User not found");

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: updateUserProfileSchema.parse(user).name,
      },
    });

    return {
      success: true,
      message: "User profile updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
