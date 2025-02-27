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

type LogInProps = {
  searchParams: Promise<{ callbackUrl: string }>;
};

export default async function LogIn({ searchParams }: LogInProps) {
  const { callbackUrl } = await searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
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
