import { z } from "zod";

import {
  insertProductSchema,
  insertShoppingBagSchema,
  shoppingBagItemSchema,
  shippingAddressSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  paymentResultSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type ShoppingBag = z.infer<typeof insertShoppingBagSchema>;

export type ShoppingBagItem = z.infer<typeof shoppingBagItemSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type OrderItem = z.infer<typeof insertOrderItemSchema>;

export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderitem: OrderItem[];
  user: {
    name: string;
    email: string;
  };
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;
