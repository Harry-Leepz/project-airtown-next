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
 * - Clears existing data from the `product and user` tables to avoid duplication or conflicts during the seeding process.
 * - Inserts sample data into the `product and user` table using the `createMany` method.
 * - Logs a success message upon successful seeding.
 */

async function seed() {
  const prisma = new PrismaClient();

  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });
  await prisma.user.createMany({ data: sampleData.users });

  console.log("Database seeded successfully");
}

seed();
