"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import {
  convertToJavaScriptObject,
  formatError,
  roundNumToTwoDp,
} from "../utils";

import { auth } from "@/auth";
import { prisma } from "@/sample-data/prisma";

import { insertShoppingBagSchema, shoppingBagItemSchema } from "../validators";
import { ShoppingBagItem } from "@/types";

const calculatePrice = (items: ShoppingBagItem[]) => {
  const priceOfItems = roundNumToTwoDp(
    items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
  );
  const shippingPrice = roundNumToTwoDp(priceOfItems > 100 ? 0 : 10);
  const taxPrice = roundNumToTwoDp(priceOfItems * 0.15);
  const totalPrice = roundNumToTwoDp(priceOfItems + taxPrice + shippingPrice);

  return {
    itemsPrice: priceOfItems.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

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

    if (!product) {
      throw new Error("Product was not found");
    }

    // check if user shopping bag exists, if not create one and add to database
    if (!userShoppingBag) {
      const createNewShoppingBag = insertShoppingBagSchema.parse({
        userId: userId,
        items: [item],
        sessionBagId: sessionBagId,
        ...calculatePrice([item]),
      });

      await prisma.shoppingBag.create({
        data: createNewShoppingBag,
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to bag`,
      };
    } else {
    }
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
