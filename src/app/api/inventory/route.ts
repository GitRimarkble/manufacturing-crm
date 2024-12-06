import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return new NextResponse(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403 }
      );
    }

    const json = await req.json();
    const material = await prisma.materialInventory.create({
      data: json,
    });

    return NextResponse.json(material);
  } catch (error) {
    console.error('Error creating material:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const materials = await prisma.materialInventory.findMany({
      where: {
        deleted: false,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(materials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
