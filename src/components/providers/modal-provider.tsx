'use client';

import CreateServerModal from '@/components/modals/reuseable-server-modal';
import { useEffect, useState } from 'react';

export const ModalProvider = () => {
  // Preventing the modals to be rendered on the server side to avoid in consistences and hydration errors
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
    </>
  );
};
