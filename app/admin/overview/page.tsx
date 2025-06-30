import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderSummary } from "@/lib/server-actions/order.actions";
import { formatCurrency } from "@/lib/utils";
import { BadgePoundSterling } from "lucide-react";
import { Metadata } from "next";

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
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Sales</CardTitle>
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
      </div>
    </div>
  );
}
