import ProductList from "@/components/shared/products/product-list";

import { getLatestProducts } from "@/lib/server-actions/product.actions";

export default async function Home() {
  const lastestProducts = await getLatestProducts();

  return (
    <>
      <ProductList data={lastestProducts} title='Newest Arrivals' limit={4} />
    </>
  );
}
