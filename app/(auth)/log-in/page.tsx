import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
};

export default function LogIn() {
  return (
    <div className='w-full max-w-md mx-auto'>
      <Card>
        <CardHeader className='space-y-4'>
          <CardTitle>Log In</CardTitle>
          <CardDescription>Log in to your account.</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Log In Form goes here */}
        </CardContent>
      </Card>
    </div>
  );
}
