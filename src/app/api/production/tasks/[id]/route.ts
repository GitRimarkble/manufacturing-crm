import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { taskSchema } from '@/lib/validations/production'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const taskId = parseInt(params.id)
    if (isNaN(taskId)) {
      return new NextResponse('Invalid task ID', { status: 400 })
    }

    const task = await prisma.task.findUnique({
      where: { 
        id: taskId,
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

    if (!task) {
      return new NextResponse('Task not found', { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error in GET /api/production/tasks/[id]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const taskId = parseInt(params.id)
    if (isNaN(taskId)) {
      return new NextResponse('Invalid task ID', { status: 400 })
    }

    const json = await req.json()
    const body = taskSchema.parse(json)

    const task = await prisma.task.update({
      where: { id: taskId },
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
    console.error('Error in PATCH /api/production/tasks/[id]:', error)
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Server Error',
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const taskId = parseInt(params.id)
    if (isNaN(taskId)) {
      return new NextResponse('Invalid task ID', { status: 400 })
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/production/tasks/[id]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
