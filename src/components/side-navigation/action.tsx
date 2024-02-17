'use client';
import { Button } from '@/components/ui/button';
import { useModal } from '@/hooks/use-modal';
import { Plus } from 'lucide-react';

const Action = () => {
  const { open } = useModal();
  return (
    <>
      <Button onClick={() => open('createServer')}>
        <Plus />
      </Button>
    </>
  );
};

export default Action;
