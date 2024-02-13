'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FileUpload from './file-upload';

const createServerModalSchema = z.object({
  name: z.string().min(3, {
    message: 'Server name must be at least 3 characters',
  }),
  imageUrl: z.string().min(1, {
    message: 'Server image image is required',
  }),
});

type TCreateServerModalSchema = z.infer<typeof createServerModalSchema>;

const CreateServerModal = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(createServerModalSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const onSubmit = async (data: TCreateServerModalSchema) => {
    reset();
  };

  if (!isMounted) return null;

  return (
    <>
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Server</DialogTitle>
            <DialogDescription>
              Create a new server to chat with friends
            </DialogDescription>
          </DialogHeader>
          {errors.name && (
            <DialogDescription>{errors.name.message}</DialogDescription>
          )}
          {errors.imageUrl && (
            <DialogDescription>{errors.imageUrl.message}</DialogDescription>
          )}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* <Input {...register('name')}></Input> */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Server Image</FormLabel>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Server name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the name of your server"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      This will be the name of you server.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  Create a new server
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateServerModal;
