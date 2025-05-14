import { auth } from "@/auth";
import PaymentMethodForm from "@/components/shared/payment-method/payment-method-form";

import { getUserById } from "@/lib/server-actions/user.actions";

export default async function PaymentMethods() {
  // get user id
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("user not found");

  // get user from database
  const user = await getUserById(userId);
  if (!user) throw new Error("No User Found");

  return (
    <div>
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </div>
  );
}
