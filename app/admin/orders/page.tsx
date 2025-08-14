import { Metadata } from "next";

import { auth } from "@/auth";
import { requireAdmin } from "@/lib/auth-guard";

import { getAllOrders } from "@/lib/server-actions/order.actions";

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
    limit: 2,
  });

  console.log("Orders:", orders);
  console.log("Total Pages:", totalPages);

  return <div>Admin Orders</div>;
}
