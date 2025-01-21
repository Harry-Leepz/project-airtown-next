import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";

import ThemeToggle from "./theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Menu() {
  return (
    <div className='flex justify-end gap-3'>
      <nav className='hidden md:flex w-full max-w-xs gap-1'>
        <ThemeToggle />
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
      </nav>

      {/* shadcn sheet menu */}
      <nav className='flex md:hidden gap-1'>
        <Sheet>
          <SheetTrigger className='align-middle'>
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className='flex flex-col items-start'>
            <SheetTitle>Menu</SheetTitle>
            <ThemeToggle />
            <Button asChild variant='ghost'>
              <Link href='/shoppingbag'>
                <ShoppingCart /> Shopping Bag
              </Link>
            </Button>
            <Button asChild>
              <Link href='/log-in'>
                <UserIcon /> Log In
              </Link>
            </Button>
            <SheetDescription />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
