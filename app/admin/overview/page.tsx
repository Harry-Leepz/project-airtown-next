import { auth } from "@/auth";
import { getOrderSummary } from "@/lib/server-actions/order.actions";
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

  return <div>Admin Overview page</div>;
}
