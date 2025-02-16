"use server";

import { cookies } from "next/headers";

import { convertToJavaScriptObject, formatError } from "../utils";

import { auth } from "@/auth";
import { prisma } from "@/sample-data/prisma";

import { shoppingBagItemSchema } from "../validators";
import { ShoppingBagItem } from "@/types";

export async function addItemToBag(data: ShoppingBagItem) {
  try {
    // check for shopping bag cookie
    const sessionBagId = (await cookies()).get("sessionBagId")?.value;

    if (!sessionBagId) throw new Error("Bag Session Not found");

    // session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get user shopping bag
    const userShoppingBag = await getUserBag();

    // parse and validate item being added to shopping bag is a valid product
    const item = shoppingBagItemSchema.parse(data);
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    // FOR TESTING ONLY -- NEEDS TO BE REMOVED
    console.log({
      "session bag id": sessionBagId,
      "user id ": userId,
      "item being added to cart": item,
      "product found": product,
    });

    return {
      success: true,
      message: "Item added to bag",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getUserBag() {
  const sessionBagId = (await cookies()).get("sessionBagId")?.value;
  if (!sessionBagId) throw new Error("Bag Session Not found");

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const shoppingBag = await prisma.shoppingBag.findFirst({
    where: userId ? { userId: userId } : { sessionBagId: sessionBagId },
  });

  if (!shoppingBag) {
    return undefined;
  }

  return convertToJavaScriptObject({
    ...shoppingBag,
    items: shoppingBag.items as ShoppingBagItem[],
    itemsPrice: shoppingBag.itemsPrice.toString(),
    taxPrice: shoppingBag.taxPrice.toString(),
    shippingPrice: shoppingBag.shippingPrice.toString(),
    totalPrice: shoppingBag.totalPrice.toString(),
  });
}
