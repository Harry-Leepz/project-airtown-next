import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { getUserById } from "@/lib/server-actions/user.actions";
import { getUserBag } from "@/lib/server-actions/bag.actions";

import ShippingAddressForm from "@/components/shared/shipping-address/shipping-address-form";
import CheckoutSteps from "@/components/shared/checkout";

import { ShippingAddress } from "@/types";

export default async function ShippingAdress() {
  // get user bag and check it is not empty
  const bag = await getUserBag();
  if (!bag || bag.items.length === 0) redirect("/shoppingbag");

  // get user id
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("No User ID");

  // get user from database
  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps currentStep={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
}
