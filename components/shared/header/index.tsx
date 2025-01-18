import Image from "next/image";
import Link from "next/link";

import { ShoppingCart, UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { APP_NAME } from "@/lib/constants";

export default function Header() {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex-between'>
        <div className='flex-start'>
          <Link href='/' className='flex-start'>
            <Image
              src='/images/logo.svg'
              alt={`${APP_NAME} logo`}
              height={48}
              width={48}
              priority
            />
            <span className='hidden lg:block font-bold text-2xl ml-3'>
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className='space-x-2'>
          <Button asChild variant='ghost'>
            <Link href='/shoppingbag'>
              <ShoppingCart />
            </Link>
          </Button>
          <Button asChild variant='ghost'>
            <Link href='/log-in'>
              <UserIcon />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
