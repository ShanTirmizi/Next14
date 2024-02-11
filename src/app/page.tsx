import { ModeToggle } from '@/components/mode-toggle';
import { db } from '@/lib/db';
import { Profile } from '@/lib/profile';
import { UserButton } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Home() {
  const profile = await Profile();
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/server/${server.id}`);
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <ModeToggle />
      <h1>Hello World</h1>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
