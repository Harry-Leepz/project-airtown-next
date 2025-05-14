"use client";
import { useTransition } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

import { paymentMethodSchema } from "@/lib/validators";

import CheckoutSteps from "../checkout";
import { DEFAULT_PAYMENT_METHOD } from "@/lib/constants";

type PaymentMethodFormProps = {
  preferredPaymentMethod: string | null;
};

export default function PaymentMethodForm({
  preferredPaymentMethod,
}: PaymentMethodFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  return (
    <>
      <CheckoutSteps currentStep={2} />
      payment-method-form
      {preferredPaymentMethod}
    </>
  );
}
