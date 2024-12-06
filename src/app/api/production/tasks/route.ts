import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { TaskWithRelations, CreateTaskRequest } from '@/types/api'
import { z } from 'zod'

const createTaskSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  assignedToId: z.number().optional(),
  productionStageId: z.number(),
  dueDate: z.string().transform(str => new Date(str)).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return errorResponse('Unauthorized', 401)
    }

    const json = await req.json()
    const validatedData = createTaskSchema.parse(json)

    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        dueDate: validatedData.dueDate,
        deleted: false,
        assignedTo: validatedData.assignedToId ? {
          connect: { id: validatedData.assignedToId }
        } : undefined,
        productionStage: {
          connect: { id: validatedData.productionStageId }
        },
      },
      include: {
        productionStage: {
          include: {
            order: {
              include: {
                customer: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return successResponse<TaskWithRelations>(task)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const { searchParams } = new URL(req.url)
    const stageId = searchParams.get('stageId')
    const status = searchParams.get('status')
    const assignedTo = searchParams.get('assignedTo')

    const validStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'] as const
    type TaskStatus = typeof validStatuses[number]

    const where = {
      deleted: false,
      ...(stageId ? { productionStageId: parseInt(stageId) } : {}),
      ...(status && validStatuses.includes(status as TaskStatus)
        ? { status: status as TaskStatus }
        : {}),
      ...(assignedTo ? { assignedToId: parseInt(assignedTo) } : {}),
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        productionStage: {
          include: {
            order: {
              include: {
                customer: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return successResponse<TaskWithRelations[]>(tasks)
  } catch (error) {
    return handleApiError(error)
  }
}
