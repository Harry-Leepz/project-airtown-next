import { Metadata } from "next";

import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

import UserProfileForm from "@/components/shared/user-profile-form";

export const metadata: Metadata = {
  title: "User Profile",
  description: "User profile page",
};

export default async function Profile() {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className='max-w-md mx-auto space-y-4'>
        <h2 className='h2-bold'>Profile</h2>

        <UserProfileForm />
      </div>
    </SessionProvider>
  );
}
