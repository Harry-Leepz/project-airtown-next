import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='p-6 rounded-lg shadow-md text-center w-1/2'>
        <h1 className='text-2xl'>
          <span className='font-bold mr-2'>404 Error</span>| The requested page
          was not found
        </h1>
        <Button asChild variant='outline' className='mt-4'>
          <Link href='/'>Go back to the home page</Link>
        </Button>
      </div>
    </div>
  );
}
