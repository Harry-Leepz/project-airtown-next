"use client";

import Image from "next/image";
import Link from "next/link";

import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useToast } from "@/hooks/use-toast";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order } from "@/types";

import {
  createPaypalOrder,
  approvePaypalOrder,
} from "@/lib/server-actions/order.actions";

type OrderDeatilsTableProps = {
  order: Order;
  paypalClientId: string;
};

export default function OrderDetailsTable({
  order,
  paypalClientId,
}: OrderDeatilsTableProps) {
  const { toast } = useToast();

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
  console.log(shippingAddress);
  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = "";

    if (isPending) {
      status = "Loading PayPal...";
    } else if (isRejected) {
      status = "PayPal failed to load.";
    } else {
      return null; // No loading state to show
    }

    return status;
  };

  const handleCreatePaypalOrder = async () => {
    const response = await createPaypalOrder(order.id);
    if (!response.success) {
      toast({
        description: response.message,
        variant: "destructive",
      });
    }

    return response.data;
  };

  const handleApprovePaypalOrder = async (data: { orderID: string }) => {
    const response = await approvePaypalOrder(order.id, data);

    toast({
      description: response.message,
      variant: response.success ? "default" : "destructive",
    });
  };

  return (
    <>
      <h1 className='py-4 text-2xl'>Order Confirmation: {formatId(id)}</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='col-span-2 space-y-4 overflow-x-auto'>
          <Card>
            <CardContent className='p-4'>
              <h2 className='text-xl pb-4'>Payment Method</h2>
              <p className='mb-2'>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant='secondary'>
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant='destructive'>Not Paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <h2 className='text-xl pb-4'>Shipping Address</h2>
              <p className='mb-1 text-sm'>{shippingAddress.fullName}</p>
              <p className='mb-1 text-sm'>
                {shippingAddress.streetAddress}, {shippingAddress.townOrCity}
              </p>
              <p className='mb-2 text-sm'>
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant='secondary'>
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant='destructive'>Not Delivered</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className='p-4'>
              <h2 className='text-xl pb-4'>Order Summary</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className='text-right'>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitem.map((item) => (
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
                            className='rounded-sm'
                          />
                          <span className='px-2'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className='px-2'>{item.qty}</span>
                      </TableCell>
                      <TableCell className='text-right'>
                        £ {item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className='p-4 gap-4 space-y-4'>
              <div className='flex justify-between'>
                <div>Subtotal</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div className='font-bold'>Total</div>
                <div className='font-bold'>{formatCurrency(totalPrice)}</div>
              </div>
              {/* Paypal Payment */}
              {!isPaid && paymentMethod === "PayPal" && (
                <div>
                  <PayPalScriptProvider
                    options={{ clientId: paypalClientId, currency: "GBP" }}
                  >
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePaypalOrder}
                      onApprove={handleApprovePaypalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
