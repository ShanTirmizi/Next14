import { db } from '@/lib/db';
import { Profile } from '@/lib/profile';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const profile = await Profile();
    const { name, type } = await req.json();
    const serverId = new URL(req.url).searchParams.get('serverId');
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!serverId) {
      return new NextResponse('Server Id missing', { status: 400 });
    }

    if (name === 'general' || name === 'General') {
      return new NextResponse("Channel name cannot be 'general'", {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MOD],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            name,
            type,
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
