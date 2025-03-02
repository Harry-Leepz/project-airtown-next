"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useToast } from "@/hooks/use-toast";
import { Loader, ArrowRight, PlusIcon, MinusIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  addItemToBag,
  removeItemfromBag,
} from "@/lib/server-actions/bag.actions";
import { formatCurrency } from "@/lib/utils";

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
          <div className='overflow-x-auto md:col-span-3'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className='text-center'>Quantity</TableHead>
                  <TableHead className='text-right'>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bag.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        href={`/product/${item.slug}`}
                        className='flex items-center'
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                          className='rounded-md'
                        />
                        <span className='px-2'>{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className='flex-center gap-2'>
                      <Button
                        disabled={isPending}
                        variant='outline'
                        type='button'
                        onClick={() =>
                          startTransition(async () => {
                            const response = await removeItemfromBag(
                              item.productId
                            );

                            if (!response.success) {
                              toast({
                                variant: "destructive",
                                description: response.message,
                              });
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className='w-4 h-4 animate-spin' />
                        ) : (
                          <MinusIcon className='w-4 h-4' />
                        )}
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        disabled={isPending}
                        variant='outline'
                        type='button'
                        onClick={() =>
                          startTransition(async () => {
                            const response = await addItemToBag(item);

                            if (!response.success) {
                              toast({
                                variant: "destructive",
                                description: response.message,
                              });
                            }
                          })
                        }
                      >
                        {isPending ? (
                          <Loader className='w-4 h-4 animate-spin' />
                        ) : (
                          <PlusIcon className='w-4 h-4' />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className='text-right'>{`£${item.price}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className='p-4 gap-4'>
              <div className='pb-3 text-xl'>
                Subtotal (
                {bag.items.reduce((acc, current) => acc + current.quantity, 0)})
                <span className='font-bold'>
                  {": "}
                  {formatCurrency(bag.itemsPrice)}{" "}
                </span>
              </div>
              <Button
                className='w-full'
                disabled={isPending}
                onClick={() =>
                  startTransition(() => router.push("/shipping-address"))
                }
              >
                {isPending ? (
                  <Loader className='w-4 h-4 animate-spin' />
                ) : (
                  <ArrowRight className='h-4 w-4' />
                )}{" "}
                Proceed to checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
