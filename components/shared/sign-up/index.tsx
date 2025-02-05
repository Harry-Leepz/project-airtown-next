"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signUpUser } from "@/lib/server-actions/user.actions";

export default function SignUpForm() {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button disabled={pending} variant='default' className='w-full'>
        {pending ? "Creating an Account" : "Sign Up"}
      </Button>
    );
  };

  return (
    <form action={action}>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
      <div className='space-y-6'>
        <div>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            autoComplete='name'
            required
            type='text'
            name='name'
            placeholder='Name'
          />
        </div>
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
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input
            id='confirmPassword'
            autoComplete='confirmPassword'
            required
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
          />
        </div>
        <div>
          <SignUpButton />
        </div>
        {data && !data.success && (
          <div className='text-center text-destructive font-bold'>
            {data.message}
          </div>
        )}
        <div className='text-sm text-center'>
          Already have an account?{" "}
          <Link
            href={"/log-in"}
            className='link font-bold hover:underline'
            target='_self'
          >
            Log In
          </Link>
        </div>
      </div>
    </form>
  );
}
