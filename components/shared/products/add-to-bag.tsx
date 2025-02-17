"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";

import { PlusIcon, MinusIcon, Loader } from "lucide-react";

import {
  addItemToBag,
  removeItemfromBag,
} from "@/lib/server-actions/bag.actions";

import { ShoppingBagItem, ShoppingBag } from "@/types";

type AddToBagProps = {
  item: ShoppingBagItem;
  bag?: ShoppingBag;
};

export default function AddToBag({ item, bag }: AddToBagProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  async function handleAddtoBag() {
    startTransition(async () => {
      const response = await addItemToBag(item);

      if (!response.success) {
        toast({
          variant: "destructive",
          description: response.message,
        });
        return;
      }

      toast({
        description: response.message,
        action: (
          <ToastAction
            className='bg-gray-700 text-white hover:bg-gray-800'
            altText='View Bag'
            onClick={() => router.push("/shoppingbag")}
          >
            View Bag
          </ToastAction>
        ),
      });
    });
  }

  async function handleRemoveFromBag() {
    startTransition(async () => {
      const response = await removeItemfromBag(item.productId);

      toast({
        variant: response.success ? "default" : "destructive",
        description: response.message,
      });

      return;
    });
  }

  const itemExistsInBag =
    bag && bag.items.find((product) => product.productId === item.productId);

  return itemExistsInBag ? (
    <div>
      <Button type='button' variant='outline' onClick={handleRemoveFromBag}>
        {isPending ? (
          <Loader className='h-4 w-4 animate-spin' />
        ) : (
          <MinusIcon className='h-4 w-4' />
        )}
      </Button>
      <span className='px-2'>{itemExistsInBag.quantity}</span>
      <Button type='button' variant='outline' onClick={handleAddtoBag}>
        {isPending ? (
          <Loader className='h-4 w-4 animate-spin' />
        ) : (
          <PlusIcon className='h-4 w-4' />
        )}
      </Button>
    </div>
  ) : (
    <Button className='w-full' type='button' onClick={handleAddtoBag}>
      {isPending ? (
        <Loader className='h-4 w-4 animate-spin' />
      ) : (
        <PlusIcon className='h-4 w-4' />
      )}
      Add to bag
    </Button>
  );
}
