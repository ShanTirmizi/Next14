import { db } from '@/lib/db';
import { userProfile } from '@/lib/user-profile';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await userProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { serverId } = params;
    if (!serverId) {
      return new NextResponse('Bad Request', { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
