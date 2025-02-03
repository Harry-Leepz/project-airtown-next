"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { logInWithCredentials } from "@/lib/server-actions/user.actions";

export default function LogInForm() {
  const [data, action] = useActionState(logInWithCredentials, {
    success: false,
    message: "",
  });

  const LogInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} variant='default' className='w-full'>
        {pending ? "Logging In" : "Log In"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <div className='space-y-6'>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            autoComplete='email'
            required
            type='email'
            name='email'
            placeholder='Email'
          />
        </div>
        <div>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            autoComplete='password'
            required
            type='password'
            name='password'
            placeholder='Password'
          />
        </div>
        <div>
          <LogInButton />
        </div>
        {data && !data.success && (
          <div className='text-center text-destructive font-bold'>
            {data.message}
          </div>
        )}
        <div className='text-sm text-center'>
          Don&apos;t have an account?{" "}
          <Link
            href={"/sign-up"}
            className='link font-bold hover:underline'
            target='_self'
          >
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
}
