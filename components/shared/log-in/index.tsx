"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LogInForm() {
  return (
    <form>
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
          <Button className='w-full'>Log In</Button>
        </div>
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
