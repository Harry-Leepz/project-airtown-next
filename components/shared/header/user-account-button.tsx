import Link from "next/link";

import { auth } from "@/auth";
import { logOutUser } from "@/lib/server-actions/user.actions";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";

export default async function UserAccountButton() {
  const session = await auth();

  if (!session) {
    return <LogInButton />;
  }

  const firstLetterOfUserName =
    session?.user?.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className='flex gap-2 items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className='flex items-center'>
            <Button
              variant='ghost'
              className='w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-slate-400'
            >
              {firstLetterOfUserName}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <div className='text-sm font-medium leading-none'>
                {session.user?.name}
              </div>
              <div className='text-muted-foreground leading-none'>
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem className='p-0 mb-1'>
            <Link
              className='w-full h-10 flex items-center justify-center px-2 '
              href='/user/profile'
            >
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='p-0 mb-1'>
            <Link
              className='w-full h-10 flex items-center justify-center px-2 '
              href='/user/orders'
            >
              Order History
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='p-0 mb-1 mt-1'>
            <form action={logOutUser} className='w-full'>
              <Button className='w-full py-4 px-2 h-10 ' variant='default'>
                Log Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function LogInButton() {
  return (
    <Button asChild variant='ghost'>
      <Link href='/log-in'>
        <UserIcon />
      </Link>
    </Button>
  );
}
