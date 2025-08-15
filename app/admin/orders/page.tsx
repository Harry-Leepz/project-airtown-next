import { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { requireAdmin } from "@/lib/auth-guard";
import { deleteOrder, getAllOrders } from "@/lib/server-actions/order.actions";
import { formatId, formatDateTime, formatCurrency } from "@/lib/utils";

import Pagination from "@/components/shared/pagination";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import DeleteDialogue from "@/components/shared/delete-dialogue";

export const metadata: Metadata = {
  title: "Admin Orders",
  description: "Manage and view all orders in the admin panel",
};

export default async function AdminOrders(props: {
  searchParams: Promise<{ page: string }>;
}) {
  await requireAdmin();

  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized Access: Admins only");
  }

  const { page = "1" } = await props.searchParams;

  const { data: orders, totalPages } = await getAllOrders({
    page: Number(page),
  });

  return (
    <div className='space-y-2'>
      <h2 className='h2-bold'>Orders</h2>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : "Not Paid"}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : "Not Delivered"}
                </TableCell>
                <TableCell className='flex items-center gap-2'>
                  <Button asChild variant='outline' size='sm'>
                    <Link
                      href={`/order/${order.id}`}
                      className='hover:underline font-medium'
                    >
                      Details
                    </Link>
                  </Button>
                  <DeleteDialogue id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={totalPages} />
        )}
      </div>
    </div>
  );
}
