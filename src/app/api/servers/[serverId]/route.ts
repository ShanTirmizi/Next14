import { db } from '@/lib/db';
import { Profile } from '@/lib/profile';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await Profile();
    const { name, imageUrl } = await req.json();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
        members: {
          some: {
            role: 'ADMIN',
          },
        },
      },
      data: {
        name,
        imageUrl,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
