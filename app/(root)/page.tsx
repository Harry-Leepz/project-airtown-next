import ProductList from "@/components/shared/products/product-list";

import sampleData from "@/sample-data/sample-data";

export default function Home() {
  return (
    <>
      <ProductList
        data={sampleData.products}
        title='Newest Arrivals'
        limit={4}
      />
    </>
  );
}
