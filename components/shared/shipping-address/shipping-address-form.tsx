"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";

import { useToast } from "@/hooks/use-toast";

import { shippingAddressSchema } from "@/lib/validators";
import { ShippingAddress } from "@/types";
import { SHIPPING_ADDRESS_FORM_DEFAULTS } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";

type ShippingAddressFormProps = {
  address: ShippingAddress;
};

export default function ShippingAddressForm({
  address,
}: ShippingAddressFormProps) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || SHIPPING_ADDRESS_FORM_DEFAULTS,
  });

  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {};

  return (
    <>
      <div className='max-w-md mx-auto space-y-4'>
        <h1 className='h2-bold mt-4'> Shipping Address</h1>
        <p className='text-sm text-muted-foreground'>
          Please enter your shipping details
        </p>
        <Form {...form}>
          <form
            method='post'
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <div className='flex flex-col md:flex-row gap-5'>
              <FormField
                control={form.control}
                name='fullName'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter full name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col md:flex-row gap-5'>
              <FormField
                control={form.control}
                name='streetAddress'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col md:flex-row gap-5'>
              <FormField
                control={form.control}
                name='townOrCity'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Town or City</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter Town or City' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col md:flex-row gap-5'>
              <FormField
                control={form.control}
                name='postalCode'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Post Code</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter post code' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col md:flex-row gap-5'>
              <FormField
                control={form.control}
                name='country'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    z.infer<typeof shippingAddressSchema>
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter country' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex gap-2'>
              <Button type='submit' disabled={isPending}>
                {isPending ? (
                  <Loader className='w-4 h-4 animate-spin' />
                ) : (
                  <ArrowRight className='w-4 h-4' />
                )}{" "}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
