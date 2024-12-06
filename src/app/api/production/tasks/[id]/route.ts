import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils';
import { TaskWithRelations, UpdateTaskRequest } from '@/types/api';
import { z } from 'zod';

const taskUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  assignedToId: z.number().optional(),
  productionStageId: z.number().optional(),
  dueDate: z.string().transform(str => new Date(str)).optional(),
});

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid ID', 400);
    }

    const task = await prisma.task.findUnique({
      where: {
        id,
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
        productionStage: true,
      },
    });

    if (!task) {
      return errorResponse('Task not found', 404);
    }

    return successResponse<TaskWithRelations>(task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return errorResponse('Insufficient permissions', 403);
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid ID', 400);
    }

    const body = await req.json();
    const validatedData = taskUpdateSchema.parse(body);

    // Transform the data to match Prisma's expected format
    const updateData: any = {
      ...validatedData,
      assignedTo: validatedData.assignedToId ? {
        connect: { id: validatedData.assignedToId }
      } : undefined,
      productionStage: validatedData.productionStageId ? {
        connect: { id: validatedData.productionStageId }
      } : undefined,
    };

    // Remove the raw IDs as we're using connect
    delete updateData.assignedToId;
    delete updateData.productionStageId;

    const task = await prisma.task.update({
      where: {
        id,
        deleted: false,
      },
      data: updateData,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        productionStage: true,
      },
    });

    return successResponse<TaskWithRelations>(task);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    if (session.user.role !== 'ADMIN') {
      return errorResponse('Insufficient permissions', 403);
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid ID', 400);
    }

    const task = await prisma.task.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    return successResponse(task);
  } catch (error) {
    return handleApiError(error);
  }
}
