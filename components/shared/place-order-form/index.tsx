"use client";

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

import { createOrder } from "@/lib/server-actions/order.actions";

import { Button } from "@/components/ui/button";
import { Check, Loader } from "lucide-react";

export default function PlaceOrderForm() {
  const router = useRouter();

  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className='w-full'>
        {pending ? (
          <Loader className='h-4 w-4 animate-spin' />
        ) : (
          <Check className='h-4 w-4' />
        )}
        Place Order
      </Button>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createOrder();
    console.log("response", response);

    if (response.redirect) {
      router.push(response.redirect);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <PlaceOrderButton />
    </form>
  );
}
