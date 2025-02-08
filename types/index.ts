import { z } from "zod";

import {
  insertProductSchema,
  insertShoppingBagSchema,
  shoppingBagItemSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
};

export type ShoppingBag = z.infer<typeof insertShoppingBagSchema>;

export type ShoppingBagItem = z.infer<typeof shoppingBagItemSchema>;
