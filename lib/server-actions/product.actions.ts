"use server";

import { prisma } from "@/sample-data/prisma";

import { convertToJavaScriptObject } from "../utils";

import { LATEST_PRODUCT_LIMIT } from "../constants";

export async function getLatestProducts() {
  // fetch 4 latest products
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCT_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  return convertToJavaScriptObject(data);
}

/*
  get a single product's data by it's slug
*/
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: {
      slug: slug,
    },
  });
}
