import { Metadata } from "next";

import { redirect } from "next/navigation";
import { auth } from "@/auth";

import LogInForm from "@/components/shared/log-in";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Log In",
};

export default async function LogIn() {
  const session = await auth();

  if (session) {
    return redirect("/");
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      <Card>
        <CardHeader className='space-y-4'>
          <CardTitle>Log In</CardTitle>
          <CardDescription>Log in to your account.</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <LogInForm />
        </CardContent>
      </Card>
    </div>
  );
}
