'use client';

import { useRouter } from 'next/navigation';
import { AccordionContent } from '../ui/accordion';
import { Button } from '../ui/button';

interface ServerListProps {
  servers: {
    id: string;
    name: string;
  }[];
}

const ServerList = ({ servers }: ServerListProps) => {
  const router = useRouter();
  const handleServerClick = (id: string) => {
    router.push(`/servers/${id}`);
  };
  return (
    <>
      {servers.map((server) => (
        <AccordionContent key={server.id}>
          <Button onClick={() => handleServerClick(server.id)}>
            {server.name}
          </Button>
        </AccordionContent>
      ))}
    </>
  );
};

export default ServerList;
