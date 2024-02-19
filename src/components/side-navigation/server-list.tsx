'use client';

import { AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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

  const handleDeleteServer = async (id: string) => {
    try {
      await axios.delete(`/api/servers`, { data: { id } });
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {servers.map((server) => (
        <AccordionContent key={server.id}>
          <Button onClick={() => handleServerClick(server.id)}>
            {server.name}
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteServer(server.id)}
          >
            Delete Server
          </Button>
        </AccordionContent>
      ))}
    </>
  );
};

export default ServerList;
