"use server";

import { ShoppingBagItem } from "@/types";

export async function addItemToBag(data: ShoppingBagItem) {
  return {
    success: false,
    message: "Woops",
  };
}
