import { userProfile } from '@/lib/user-profile';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await userProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: {
            name: 'general',
            profileId: profile.id,
          },
        },
        members: {
          create: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const profile = await userProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await db.member.deleteMany({
      where: {
        serverId: id,
      },
    });

    await db.channel.deleteMany({
      where: {
        serverId: id,
      },
    });

    const server = await db.server.findFirst({
      where: {
        id,
      },
    });

    if (!server) {
      return new NextResponse('Not Found', { status: 404 });
    }

    await db.server.delete({
      where: {
        id,
      },
    });

    return new NextResponse('Deleted', { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
