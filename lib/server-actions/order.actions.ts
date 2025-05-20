"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";

import { auth } from "@/auth";

import { formatError } from "../utils";

import { getUserById } from "./user.actions";
import { getUserBag } from "./bag.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/sample-data/prisma";
import { ShoppingBagItem } from "@/types";

// create orders and create order items
export async function createOrder() {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    const shoppingBag = await getUserBag();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");

    const user = await getUserById(userId);

    // check if bag exists and is not empty
    if (!shoppingBag || shoppingBag.items.length === 0) {
      return {
        success: false,
        message: "No items in shopping bag",
        redirect: "/shopping-bag",
      };
    }

    // check if user adress exists
    if (!user.address) {
      return {
        success: false,
        message: "No address found",
        redirect: "/shipping-address",
      };
    }

    // check if user payment method exists
    if (!user.paymentMethod) {
      return {
        success: false,
        message: "No payment method found",
        redirect: "/payment-method",
      };
    }

    // create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: shoppingBag.itemsPrice,
      shippingPrice: shoppingBag.shippingPrice,
      taxPrice: shoppingBag.taxPrice,
      totalPrice: shoppingBag.totalPrice,
    });

    // create a transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // create order
      const insertedOrder = await tx.order.create({
        data: order,
      });

      // create order items from the shhopping bag items
      for (const item of shoppingBag.items as ShoppingBagItem[]) {
        await tx.orderItem.create({
          data: {
            productId: item.productId,
            name: item.name,
            slug: item.slug,
            image: item.image,
            price: item.price,
            qty: item.quantity,
            orderId: insertedOrder.id,
          },
        });
      }
      // clear the shopping bag
      await tx.shoppingBag.update({
        where: { id: shoppingBag.id },
        data: {
          items: [],
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      });

      return insertedOrder.id;
    });

    if (!insertedOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "Order created successfully",
      redirect: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatError(error),
    };
  }
}
