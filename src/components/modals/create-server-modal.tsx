'use client';
import FileUpload from '@/components/file-upload';
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
import { Input } from '@/components/ui/input';
import { useModal } from '@/hooks/use-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  const { isOpen, close, type } = useModal();

  const router = useRouter();

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
    try {
      await axios.post('/api/servers', data);
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

  const isModalOpen = isOpen && type === 'createServer';

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogTrigger asChild>
          <Button variant="outline">Create a new server</Button>
        </DialogTrigger>
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
