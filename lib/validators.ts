import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

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
  password: z.string().min(6, "Password must be atleast 6 characters"),
});

// schema for user account sign up
export const signUpFormSchema = z
  .object({
    email: z.string().email("Invalid e-mail address"),
    password: z.string().min(6, "Password must be atleast 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be atleast 6 characters"),
    name: z.string().min(2, "Name must be atleast 2 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// product in shopping in bag schema
export const shoppingBagItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  quantity: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: priceValidation,
});

export const insertShoppingBagSchema = z.object({
  items: z.array(shoppingBagItemSchema),
  itemsPrice: priceValidation,
  totalPrice: priceValidation,
  shippingPrice: priceValidation,
  taxPrice: priceValidation,
  sessionBagId: z.string().min(1, "Session Bag id is required"),
  userId: z.string().optional().nullable(),
});

// schema for shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be atleast 3 characters"),
  streetAddress: z.string().min(3, "Address must be atleast 3 characters"),
  townOrCity: z.string().min(3, "Town or City must be atleast 3 characters"),
  postalCode: z.string().min(3, "Postal code must be atleast 3 characters"),
  country: z.string().min(3, "Country must be atleast 3 characters"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// schema for payment method
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    message: "Invalid payment method",
    path: ["type"],
  });

// schema for inserting an order and order items
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "User id is required"),
  itemsPrice: priceValidation,
  shippingPrice: priceValidation,
  taxPrice: priceValidation,
  totalPrice: priceValidation,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment method",
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  productId: z.string().min(1, "Product id is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a positive number"),
  image: z.string().min(1, "Image is required"),
  price: priceValidation,
});
