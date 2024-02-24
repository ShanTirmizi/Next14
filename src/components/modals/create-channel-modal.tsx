'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { useModal } from '@/hooks/use-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChannelType } from '@prisma/client';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import qs from 'query-string';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const createServerModalSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Channel name must be at least 3 characters',
    })
    .refine((value) => value !== 'general', {
      message: "Channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});

type TCreateServerModalSchema = z.infer<typeof createServerModalSchema>;

const CreateChannelModal = () => {
  const { isOpen, close, type } = useModal();

  const router = useRouter();
  const params = useParams();

  const form = useForm({
    resolver: zodResolver(createServerModalSchema),
    defaultValues: {
      name: '',
      type: ChannelType.TEXT,
    },
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const onSubmit = async (data: TCreateServerModalSchema) => {
    try {
      const url = qs.stringifyUrl({
        url: '/api/channels',
        query: {
          serverId: params.serverId,
        },
      });
      await axios.post(url, data);
      router.refresh();
      window.location.reload();
      reset();
      close();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    reset();
    close();
  };

  const isModalOpen = isOpen && type === 'createChannel';

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogTrigger asChild>
          <Button variant="outline">Create a new channel</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create channel</DialogTitle>
            <DialogDescription>
              Create a new channel to chat with friends
            </DialogDescription>
          </DialogHeader>
          {errors.name && (
            <DialogDescription>{errors.name.message}</DialogDescription>
          )}
          {errors.type && (
            <DialogDescription>{errors.type.message}</DialogDescription>
          )}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel type</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ChannelType.TEXT}>Text</SelectItem>
                          <SelectItem value={ChannelType.AUDIO}>
                            Audio
                          </SelectItem>
                          <SelectItem value={ChannelType.VIDEO}>
                            Video
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      This will be the type of you channel.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the name of your channel"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      This will be the name of you channel.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  Create a new channel
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannelModal;
