import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { taskSchema } from '@/lib/validations/production'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await req.json()
    const body = taskSchema.parse(json)

    const task = await prisma.task.create({
      data: {
        title: body.name,
        description: body.description,
        status: body.status,
        assignedTo: body.assignedTo ? {
          connect: { id: body.assignedTo }
        } : undefined,
        productionStage: {
          connect: { id: body.stageId }
        },
        deleted: false,
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

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error in POST /api/production/tasks:', error)
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
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

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error in GET /api/production/tasks:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
