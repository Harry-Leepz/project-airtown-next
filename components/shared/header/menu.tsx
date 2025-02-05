import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EllipsisVertical, ShoppingCart } from "lucide-react";

import ThemeToggle from "./theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserAccountButton from "./user-account-button";

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
        <UserAccountButton />
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
            <UserAccountButton />
            <SheetDescription />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
