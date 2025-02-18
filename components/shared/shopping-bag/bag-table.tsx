"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useToast } from "@/hooks/use-toast";
import { Loader, ArrowRight, PlusIcon, MinusIcon } from "lucide-react";

import {
  addItemToBag,
  removeItemfromBag,
} from "@/lib/server-actions/bag.actions";

import { ShoppingBag } from "@/types";

type BagTableProps = {
  bag?: ShoppingBag;
};

export default function BagTable({ bag }: BagTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className='py-4 h1-bold'>Shopping Bag</h1>

      {!bag ||
        (bag.items.length === 0 && (
          <>
            Your shopping bag is empty. <Link href={"/"}>Start shopping</Link>
          </>
        ))}
      {bag && bag.items.length > 0 && (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>Table</div>
        </div>
      )}
    </>
  );
}
