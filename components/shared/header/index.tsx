import Link from "next/link";

import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import { Building2 } from "lucide-react";

export default function Header() {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex-between'>
        <div className='flex-start'>
          <Link href='/' className='flex-start'>
            <Building2 className='h-8 w-8' />
            <span className=' font-bold text-2xl ml-3'>{APP_NAME}</span>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
}
