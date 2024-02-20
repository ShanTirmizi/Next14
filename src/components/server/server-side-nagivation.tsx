import ServerHeader from '@/components/server/server-header';
import { db } from '@/lib/db';
import { Profile } from '@/lib/profile';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';

interface ServerSideNavigationProps {
  serverId: string;
}

const ServerSideNavigation = async ({
  serverId,
}: ServerSideNavigationProps) => {
  const profile = await Profile();
  if (!profile) {
    return redirect('/');
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });

  if (!server) {
    return redirect('/');
  }

  const messageChannel = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );
  const voiceChannel = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );
  const videoChannel = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );

  const members = server.members.filter(
    (member) => member.profileId !== profile.id,
  );

  const role = server.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  return (
    <>
      <div className="flex flex-col h-full">
        <ServerHeader server={server} role={role} />
      </div>
    </>
  );
};

export default ServerSideNavigation;
