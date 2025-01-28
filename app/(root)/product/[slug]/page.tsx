import { notFound } from "next/navigation";

import { getProductBySlug } from "@/lib/server-actions/product.actions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/shared/products/product-price";

type ProductDetailsProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetails({ params }: ProductDetailsProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5'>
          <div className='col-span-2'>{/* Product Image Goes Here! */}</div>
          {/* Product Details */}
          <div className='col-span-2 p-5'>
            <div className='flex flex-col'>
              <h1 className='h1-bold mb-8'>{product.name}</h1>
              <p className='font-medium text-sm'>{product.brand}</p>
              <p className='font-light text-xs mb-12'>{product.category}</p>
              <div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-4'>
                <ProductPrice
                  value={Number(product.price)}
                  className='text-4xl'
                />
              </div>

              <p className='text-sm'>
                {product.rating} Stars | {product.numReviews} reviews
              </p>
            </div>
            <div className='mt-10'>
              <p className='font-bold text-sm'>Description</p>
              <p className='font-normal'>{product.description}</p>
            </div>
          </div>
          {/* Product Stock and Add to Bag */}
          <div>
            <Card>
              <CardContent className='p-4'>
                <div className='flex justify-between mb-2'>
                  <div>Status</div>
                  {product.stock > 0 && (
                    <Badge variant={"default"}>In Stock</Badge>
                  )}
                  {product.stock === 0 && (
                    <Badge variant={"destructive"}>Out of stock</Badge>
                  )}
                </div>
                {product.stock > 0 && (
                  <div className='mt-8'>
                    <Button className='w-full'>+ Add to Bag</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
