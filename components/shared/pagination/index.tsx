"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { formUrlQuery } from "@/lib/utils";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

export default function Pagination({
  page,
  totalPages,
  urlParamName,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClick(direction: "next" | "previous") {
    const pageValue =
      direction === "next" ? Number(page) + 1 : Number(page) - 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || "page",
      value: pageValue.toString(),
    });

    router.push(newUrl);
  }

  return (
    <div className='flex gap-2'>
      <Button
        size='lg'
        variant='outline'
        disabled={Number(page) === 1}
        className='w-28'
        onClick={() => handleClick("previous")}
      >
        <ArrowLeft /> Previous
      </Button>
      <Button
        size='lg'
        variant='outline'
        disabled={Number(page) >= totalPages}
        className='w-28'
        onClick={() => handleClick("next")}
      >
        Next <ArrowRight />
      </Button>
    </div>
  );
}
