import { Metadata } from "next";

import { redirect } from "next/navigation";
import { auth } from "@/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignUpForm from "@/components/shared/sign-up";

export const metadata: Metadata = {
  title: "Sign Up",
};

type LogInProps = {
  searchParams: Promise<{ callbackUrl: string }>;
};

export default async function SignUp({ searchParams }: LogInProps) {
  const { callbackUrl } = await searchParams;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className='w-full max-w-md mx-auto'>
      <Card>
        <CardHeader className='space-y-4'>
          <CardTitle>New to Project Airtown?</CardTitle>
          <CardDescription>
            Creating an account is quick and simple
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
