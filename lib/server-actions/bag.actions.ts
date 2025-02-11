"use server";

import { cookies } from "next/headers";

import { formatError } from "../utils";

import { ShoppingBagItem } from "@/types";
import { auth } from "@/auth";

export async function addItemToBag(data: ShoppingBagItem) {
  try {
    // check for shopping bag cookie
    const sessionBagId = (await cookies()).get("sessionBagId")?.value;

    if (!sessionBagId) throw new Error("Bag Session Not found");

    // session and user id
    const session = await auth();
    const userId = session?.user?.id ? session.user.id : undefined;

    // FOR TESTING ONLY -- NEEDS TO BE REMOVED
    console.log({
      "session bag id": sessionBagId,
      "user id ": userId,
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
