"use server";

import { PrismaClient } from "@prisma/client";

import { convertToJavaScriptObject } from "../utils";

import { LATEST_PRODUCT_LIMIT } from "../constants";

export async function getLatestProducts() {
  const prisma = new PrismaClient();

  // fetch 4 latest products
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCT_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToJavaScriptObject(data);
}
