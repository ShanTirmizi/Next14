'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useModal } from '@/hooks/use-modal';
import usePath from '@/hooks/use-path';
import axios from 'axios';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

const InviteModal = () => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, close, type, data, open } = useModal();
  const path = usePath();

  const isModalOpen = isOpen && type === 'invite';

  const { server } = data;

  const inviteUrl = `${path}/invite/${server?.inviteCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const newInviteCode = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/servers/${server?.id}/invite`);
      open('invite', {
        server: response.data,
      });
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
            <DialogTitle>Invite team members</DialogTitle>
          </DialogHeader>
          <div>
            <p>Invite team members to your server</p>
            <Label>Server invite link</Label>
            <Input
              type="text"
              value={inviteUrl}
              readOnly
              disabled={isLoading}
            />
            <Button onClick={copyLink} disabled={isLoading}>
              Copy link
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
          <Button variant="link" onClick={newInviteCode} disabled={isLoading}>
            Generate new link
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteModal;
