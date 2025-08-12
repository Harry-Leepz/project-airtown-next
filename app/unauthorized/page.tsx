import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Unauthorized",
  description: "You are not authorized to view this page.",
};

export default function UnauthorizedPage() {
  return (
    <div className='container mx-auto flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)] flex'>
      <h1 className='h1-bold text-4xl'>Unauthorized Access</h1>
      <p className='text-muted-foreground'>
        You do not have permission to access this page.
      </p>

      <Button asChild>
        <Link href='/'>Return Home</Link>
      </Button>
    </div>
  );
}
