import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { auth } from "@/auth";
import { getUserBag } from "@/lib/server-actions/bag.actions";
import { getUserById } from "@/lib/server-actions/user.actions";

import CheckoutSteps from "@/components/shared/checkout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PlaceOrderForm from "@/components/shared/place-order-form";

import { ShippingAddress } from "@/types";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Place Order",
};

export default async function PlaceOrder() {
  const shoppingBag = await getUserBag();
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not found");
  }

  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!shoppingBag || shoppingBag.items.length === 0) redirect("/shoppingbag");
  if (!user.address) redirect("/shipping-address");
  if (!user.paymentMethod) redirect("/payment-method");

  const userAddress = user.address as ShippingAddress;

  return (
    <>
      <CheckoutSteps currentStep={3} />
      <h1 className='h2-bold py-4'>Place Order</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='md:col-span-2 overflow-x-auto space-y-4'>
          {/* Shipping Adress Info */}
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Shipping Address</h2>
              <p>{userAddress.fullName}</p>
              <p>
                {userAddress.streetAddress}, {userAddress.townOrCity}
              </p>
              <p>
                {userAddress.postalCode}, {userAddress.country}
              </p>
              <div className='mt-3'>
                <Link href='/shipping-address'>
                  <Button variant='default' size='sm'>
                    Edit Shipping Address
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          {/* Payment Method Info */}
          <Card>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Payment Method</h2>
              <p>{user.paymentMethod}</p>

              <div className='mt-3'>
                <Link href='/payment-method'>
                  <Button variant='default' size='sm'>
                    Edit Payment Method
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          {/* Order Summary */}
          <Card>
            <CardContent className='p-4 gap-4'>
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
                  {shoppingBag.items.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/products/${item.slug}`}
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
                        <span className='px-2'>{item.quantity}</span>
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
        {/* Shipping Details */}
        <div>
          <Card>
            <CardContent className='p-4 gap-4 space-y-4'>
              <div className='flex justify-between'>
                <div>Subtotal</div>
                <div>{formatCurrency(shoppingBag.itemsPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Tax</div>
                <div>{formatCurrency(shoppingBag.taxPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Shipping</div>
                <div>{formatCurrency(shoppingBag.shippingPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div className='font-bold'>Total</div>
                <div className='font-bold'>
                  {formatCurrency(shoppingBag.totalPrice)}
                </div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
