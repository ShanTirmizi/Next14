import Action from '@/components/side-navigation/action';
import ServerList from '@/components/side-navigation/server-list';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { db } from '@/lib/db';
import { UserButton, auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const SideNavigation = async () => {
  const { userId } = auth();
  if (!userId) return null;

  const profile = await db.profile.findUnique({
    where: { userId },
  });

  if (!profile) redirect('/');

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  return (
    <>
      <Accordion type="multiple" className="w-full h-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Servers</AccordionTrigger>
          <Action />
          <ServerList servers={servers} />
        </AccordionItem>
      </Accordion>
      <UserButton afterSignOutUrl="/" />
    </>
  );
};

export default SideNavigation;
