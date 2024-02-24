import { db } from '@/lib/db';
import { Profile } from '@/lib/profile';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await Profile();
    const serverId = new URL(req.url).searchParams.get('serverId');
    const memberId = params.memberId;
    const { role } = await req.json();
    if (!serverId) {
      return new NextResponse('Server Id missing', { status: 400 });
    }
    if (!memberId) {
      return new NextResponse('Member Id missing', { status: 400 });
    }
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
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
    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const profile = await Profile();
    const serverId = new URL(req.url).searchParams.get('serverId');
    const memberId = params.memberId;
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!serverId) {
      return new NextResponse('Server Id missing', { status: 400 });
    }
    if (!memberId) {
      return new NextResponse('Member Id missing', { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          delete: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
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
    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
