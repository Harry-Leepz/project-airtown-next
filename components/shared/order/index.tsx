"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";

type OrderDeatilsTableProps = {
  order: Order;
};

export default function OrderDetailsTable({ order }: OrderDeatilsTableProps) {
  const {
    shippingAddress,
    orderitem,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    isDelivered,
    id,
    paidAt,
    deliveredAt,
  } = order;
  return (
    <>
      <h1 className='py-4 text-2xl'>Order Confirmation: {formatId(id)}</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='col-span-2 space-y-4 overflow-x-auto'>
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant='secondary'>
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant='destructive'>Not Paid</Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
