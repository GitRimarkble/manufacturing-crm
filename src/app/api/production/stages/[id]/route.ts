import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid ID' }),
        { status: 400 }
      );
    }

    const stage = await prisma.productionStage.findUnique({
      where: {
        id,
        deleted: false,
      },
      include: {
        tasks: {
          where: {
            deleted: false,
          },
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!stage) {
      return new NextResponse(
        JSON.stringify({ error: 'Production stage not found' }),
        { status: 404 }
      );
    }

    return NextResponse.json(stage);
  } catch (error) {
    console.error('Error fetching production stage:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid ID' }),
        { status: 400 }
      );
    }

    const body = await request.json();
    const stage = await prisma.productionStage.update({
      where: {
        id,
        deleted: false,
      },
      data: body,
      include: {
        tasks: {
          where: {
            deleted: false,
          },
          include: {
            assignedTo: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(stage);
  } catch (error) {
    console.error('Error updating production stage:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return new NextResponse(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { status: 403 }
      );
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid ID' }),
        { status: 400 }
      );
    }

    // Soft delete the production stage and its tasks
    const stage = await prisma.$transaction(async (tx) => {
      // First soft delete all tasks
      await tx.task.updateMany({
        where: {
          productionStageId: id,
          deleted: false,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });

      // Then soft delete the stage
      return tx.productionStage.update({
        where: {
          id,
          deleted: false,
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });
    });

    return NextResponse.json(stage);
  } catch (error) {
    console.error('Error deleting production stage:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
