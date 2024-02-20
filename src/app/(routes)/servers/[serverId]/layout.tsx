import ServerSideNavigation from '@/components/server/server-side-nagivation';
import { db } from '@/lib/db';
import { Profile } from '@/lib/profile';
import { redirectToSignUp } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

interface LayoutProps {
  params: {
    serverId: string;
  };
  children: React.ReactNode;
}

const layout = async ({ params, children }: LayoutProps) => {
  const { serverId } = params;
  const profile = await Profile();

  if (!profile) {
    return redirectToSignUp();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect('/');
  }

  return (
    <>
      <div className="h-full">
        <div className="w-60 h-full md:flex z-20 flex-col inset-y-0 hidden">
          <ServerSideNavigation serverId={serverId} />
        </div>
        <main className="h-full">{children}</main>
      </div>
    </>
  );
};

export default layout;
