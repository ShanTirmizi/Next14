import { db } from '@/lib/db';
import { Profile } from '@/lib/profile';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface InviteCodeProps {
  params: {
    inviteCode: string;
  };
}
const InviteCode = async ({ params }: InviteCodeProps) => {
  const profile = await Profile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    redirect('/');
  }

  const isServerExists = await db.server.findUnique({
    where: {
      inviteCode: params.inviteCode,
    },
  });

  if (!isServerExists) {
    return redirect('/');
  }

  const existingServerMember = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (existingServerMember) {
    redirect(`/servers/${existingServerMember.id}`);
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return redirect('/');
};

export default InviteCode;
