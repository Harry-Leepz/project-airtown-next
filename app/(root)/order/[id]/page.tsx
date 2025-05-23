import { Metadata } from "next";
import { notFound } from "next/navigation";

import { getOrderById } from "@/lib/server-actions/order.actions";

// import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function OrderDetails(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  return <div>order details page</div>;
}
