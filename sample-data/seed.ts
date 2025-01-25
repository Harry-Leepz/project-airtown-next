import { PrismaClient } from "@prisma/client";
import sampleData from "./sample-data";

/*
 * seed.ts
 *
 * Purpose:
 * This script is designed to seed the database with sample data for development or testing purposes.
 * It ensures the database is populated with initial records.
 *
 * Functionality:
 * - Establishes a connection to the database using the Prisma ORM.
 * - Clears existing data from the `product` table to avoid duplication or conflicts during the seeding process.
 * - Inserts sample data into the `product` table using the `createMany` method.
 * - Logs a success message upon successful seeding.
 */

async function seed() {
  const prisma = new PrismaClient();

  await prisma.product.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });

  console.log("Database seeded successfully");
}

seed();
