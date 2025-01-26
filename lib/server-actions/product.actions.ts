"use server";

import { PrismaClient } from "@prisma/client";

import { convertToJavaScriptObject } from "../utils";

export async function getLatestProducts() {
  const prisma = new PrismaClient();

  // fetch 4 latest products
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return convertToJavaScriptObject(data);
}
