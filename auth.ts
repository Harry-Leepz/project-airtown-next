import NextAuth from "next-auth";
import { cookies } from "next/headers";

import { NextResponse } from "next/server";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token }: any) {
      // set user id from token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // check for any updates and update user name
      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, trigger }) {
      // add the user role to jwt
      if (user && "role" in user) {
        token.id = user.id;
        token.role = user.role;

        // update user name from email
        if (user.name === "NO_NAME") {
          if (user.email) {
            token.name = user.email.split("@")[0];

            // db update
            await prisma.user.update({
              where: { id: user.id },
              data: { name: token.name },
            });
          }
        }

        // persist the current shopping bag after the user logs in
        if (trigger === "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionBagId = cookiesObject.get("sessionBagId")?.value;

          if (sessionBagId) {
            const sessionBag = await prisma.shoppingBag.findFirst({
              where: { sessionBagId },
            });

            if (sessionBag) {
              // delete any prior existsing shopping bag in db
              await prisma.shoppingBag.deleteMany({
                where: { userId: user.id },
              });

              // assign new shopping bag
              await prisma.shoppingBag.update({
                where: { id: sessionBag.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }
      return token;
    },
    authorized({ request, auth }) {
      // protected url paths required by auth
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      const { pathname } = request.nextUrl;

      // check if current user is not authenticated and trying to access protected url path
      if (!auth && protectedPaths.some((path) => path.test(pathname))) {
        return false;
      }

      if (!request.cookies.get("sessionBagId")) {
        // check for session shopping bag cookie
        // generate new session bag id cookie
        const sessionBagId = crypto.randomUUID();

        // clone request headers
        const newRequestHeaders = new Headers(request.headers);

        // create new response and add new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // set newly generated sessionBagId in response cookies
        response.cookies.set("sessionBagId", sessionBagId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
