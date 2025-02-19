'use client';

import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useToast } from '@/hooks/use-toast';
import { updateProfile } from '@/lib/actions/user.actions';
import { updateProfileSchema } from '@/lib/validators';

export default function ProfileForm() {
  const { data: session, update } = useSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? ''
    }
  });

  async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    const res = await updateProfile(values);

    if (!res.success) {
      return toast({
        variant: 'destructive',
        description: res.message
      });
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name
      }
    };

    await update(newSession);

    toast({
      description: res.message,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-5">
          <FormField 
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input disabled placeholder="email" className='input-field' {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormControl>
                  <Input
                    placeholder='Name'
                    className='input-field'
                    {...field}
                  />
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
          {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  );
}