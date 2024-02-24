import { useEffect, useState } from 'react';

const usePath = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  const path =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  return path;
};

export default usePath;
