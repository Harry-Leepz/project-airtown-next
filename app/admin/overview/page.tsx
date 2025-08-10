import { Metadata } from "next";

import { auth } from "@/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getOrderSummary } from "@/lib/server-actions/order.actions";
import { formatCurrency, formatNumber } from "@/lib/utils";
import {
  BadgePoundSterling,
  Barcode,
  CreditCardIcon,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Overview page for admin users",
};

export default async function AdminOverview() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized access: Admins only");
  }

  const summary = await getOrderSummary();

  return (
    <div className='space-y-2'>
      <h1 className='h2-bold'>Admin Dashboard</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {/* Sales */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <BadgePoundSterling />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatCurrency(
                summary.totalSales._sum.totalPrice?.toString() || 0
              )}
            </div>
          </CardContent>
        </Card>
        {/* Number of Orders Placed */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Sales</CardTitle>
            <CreditCardIcon />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(summary.ordersCount)}
            </div>
          </CardContent>
        </Card>
        {/* Number of Customers */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Customers</CardTitle>
            <Users />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(summary.usersCount)}
            </div>
          </CardContent>
        </Card>
        {/* Number of Products */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Products</CardTitle>
            <Barcode />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {formatNumber(summary.productsCount)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
