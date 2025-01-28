"use client";
import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type ProductImagesProps = {
  images: string[];
};

export default function ProductImages({ images }: ProductImagesProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className='space-y-4'>
      <Image
        src={images[currentImageIndex]}
        alt='product image'
        width={1000}
        height={1000}
        className='min-h-[300px] object-cover object-center rounded-lg'
      />
      <div className='flex'>
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={cn(
              "border-2 mr-2 cursor-pointer hover:border-orange-500 rounded-lg ",
              currentImageIndex === index && "border-orange-600"
            )}
          >
            <Image
              src={image}
              alt='image'
              width={100}
              height={100}
              className='rounded-md'
            />
          </div>
        ))}
      </div>
    </div>
  );
}
