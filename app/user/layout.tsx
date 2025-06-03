import Link from "next/link";

import Menu from "@/components/shared/header/menu";
import UserNav from "@/components/shared/user-nav";

import { APP_NAME } from "@/lib/constants";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className='flex flex-col'>
        <div className='container border-b mx-auto'>
          <div className='flex items-center h-16 px-4'>
            <Link href='/' className='w-22 '>
              <span className='text-lg font-semibold'>{APP_NAME}</span>
            </Link>
            <UserNav className='mx-6' />
            <div className='ml-auto items-center flex space-x-4'>
              <Menu />
            </div>
          </div>
        </div>
        <div className='flex-1 space-y-4 p-8 pt-6 container mx-auto'>
          {children}
        </div>
      </div>
    </>
  );
}
