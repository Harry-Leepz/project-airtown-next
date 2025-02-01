import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/sample-data/prisma";

import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";

import type { NextAuthConfig } from "next-auth";

/*
 * NextAuth Configuration
 *
 * This file configures authentication for a Next.js application using NextAuth.
 * It utilizes Prisma as the database adapter and supports email/password authentication.
 *
 * References:
 * - NextAuth Options: https://next-auth.js.org/configuration/options
 * - Credentials Provider: https://next-auth.js.org/providers/credentials
 * - NextAuth Callbacks: https://next-auth.js.org/configuration/callbacks
 */

export const config = {
  pages: {
    signIn: "/log-in",
    error: "/log-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //  30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials === null) return null;

        // find user in database
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        // check if user exists and if password matches
        if (user && user.password) {
          const isPasswordMatching = compareSync(
            credentials.password as string,
            user.password
          );

          // if password matches return user
          if (isPasswordMatching) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }

        // if user does not exist or pass does not match
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }) {
      // set user id from token
      if (token.sub) {
        session.user.id = token.sub;
      }

      // check for any updates and update user name
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
