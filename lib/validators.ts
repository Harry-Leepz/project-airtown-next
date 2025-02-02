import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const priceValidation = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    "Prices must have exactly two declimal places"
  );

// schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, "Name must be atleast 3 characters"),
  slug: z.string().min(3, "Slug must be atleast 3 characters"),
  category: z.string().min(3, "Category must be atleast 3 characters"),
  brand: z.string().min(3, "Brand must be atleast 3 characters"),
  description: z.string().min(3, "Description must be atleast 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product should have atleast one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: priceValidation,
});

// schema for logging users in
export const logInFormSchema = z.object({
  email: z.string().email("Invalid e-mail address"),
  password: z.string().min(8, "Password must be atleast 8 characters"),
});
