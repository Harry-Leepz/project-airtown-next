import BagTable from "@/components/shared/shopping-bag/bag-table";

import { getUserBag } from "@/lib/server-actions/bag.actions";

export const metadata = {
  title: "Your Bag",
};

export default async function ShoppingBag() {
  const userBag = await getUserBag();

  return (
    <div>
      <BagTable bag={userBag} />
    </div>
  );
}
