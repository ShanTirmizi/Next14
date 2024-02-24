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
import { useModal } from '@/hooks/use-modal';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const InviteModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, close, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === 'leaveServer';

  const { server } = data;

  const onLeaveServer = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server?.id}/leave`);
      close();
      router.refresh();
      router.push('/');
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={close}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Servers</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p>
              Are you sure you want to leave{' '}
              <span className="text-rose-500">{server?.name}</span>?
            </p>
          </DialogDescription>
          <DialogFooter>
            <Button
              className="bg-gray-200 hover:bg-gray-300"
              onClick={close}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-rose-800 hover:bg-rose-600"
              onClick={onLeaveServer}
              disabled={isLoading}
            >
              Leave Server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;
