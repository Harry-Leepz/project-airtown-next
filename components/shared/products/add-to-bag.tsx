"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";

import { PlusIcon } from "lucide-react";

import { addItemToBag } from "@/lib/server-actions/bag.actions";

import { ShoppingBagItem } from "@/types";

type AddToBagProps = {
  item: ShoppingBagItem;
};

export default function AddToBag({ item }: AddToBagProps) {
  const router = useRouter();
  const { toast } = useToast();

  async function handleAddtoBag() {
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
  }

  return (
    <Button className='w-full' type='button' onClick={handleAddtoBag}>
      <PlusIcon /> Add to bag
    </Button>
  );
}
