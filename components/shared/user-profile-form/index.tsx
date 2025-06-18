"use client";

import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateUserProfileSchema } from "@/lib/validators";
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

import { updateUserProfile } from "@/lib/server-actions/user.actions";

export default function UserProfileForm() {
  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof updateUserProfileSchema>>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? "",
    },
  });

  const { toast } = useToast();

  const handleOnSubmit = async (
    values: z.infer<typeof updateUserProfileSchema>
  ) => {
    const response = await updateUserProfile(values);

    if (!response.success) {
      return toast({
        variant: "destructive",
        description: response.message,
      });
    }

    // Update session with new user data
    const updateSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    };

    await update(updateSession);

    toast({
      description: response.message,
    });
  };

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-5'
        onSubmit={form.handleSubmit(handleOnSubmit)}
      >
        <div className='flex flex-col gap-5'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-sm font-medium'>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    placeholder='Email'
                    className='input'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='text-sm font-medium'>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Name' className='input' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type='submit'
          size='lg'
          className='button col-span-2 w-full'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Saving..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}
