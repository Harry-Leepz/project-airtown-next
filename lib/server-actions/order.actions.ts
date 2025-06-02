"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";

import { convertToJavaScriptObject, formatError } from "../utils";

import { getUserById } from "./user.actions";
import { getUserBag } from "./bag.actions";
import { insertOrderSchema } from "../validators";
import { prisma } from "@/sample-data/prisma";
import { ShoppingBagItem, PaymentResult } from "@/types";

import { paypal } from "../paypal";

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

// get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitem: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return convertToJavaScriptObject(data);
}

// create a new paypal order
export async function createPaypalOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
      // create a new paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      // update order with paypal order id
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: "",
            status: "",
            price_paid: "0",
          },
        },
      });

      return {
        success: true,
        message: "Paypal order created successfully",
        data: paypalOrder.id,
      };
    } else {
      throw new Error("Order not found");
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// approve paypal order and update order to paid
export async function approvePaypalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error("Order not found");

    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("As errord occurred with paypal payment");
    }

    // update order with payment result
    await updateOrderToPaid({
      orderId: orderId,
      paymentResult: {
        id: captureData.id,
        email_address: captureData.payer.email_address,
        status: captureData.status,
        price_paid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return {
      success: true,
      message: "Order paid successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// update order to paid
async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitem: true,
    },
  });

  if (!order) throw new Error("Order not found");

  if (order.isPaid) {
    throw new Error("Order is already paid");
  }

  // transaction to update order  and account for product stock
  await prisma.$transaction(async (tx) => {
    // iterate over order items and update product stock
    for (const item of order.orderitem) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: -item.qty,
          },
        },
      });
    }

    // update order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  // get updates order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderitem: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!updatedOrder) throw new Error("Order not found after update");
}
