import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productionStageSchema } from '@/lib/validations/production'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await req.json()
    const body = productionStageSchema.parse(json)

    const stage = await prisma.productionStage.create({
      data: {
        ...body,
        deleted: false,
      },
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
        tasks: {
          where: {
            deleted: false,
          },
        },
      },
    })

    return NextResponse.json(stage)
  } catch (error) {
    console.error('Error in POST /api/production/stages:', error)
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
    const orderId = searchParams.get('orderId')
    const status = searchParams.get('status')

    const validStatuses = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED'] as const
    type ProductionStageStatus = typeof validStatuses[number]

    const where = {
      deleted: false,
      ...(orderId ? { orderId: parseInt(orderId) } : {}),
      ...(status && validStatuses.includes(status as ProductionStageStatus)
        ? { status: status as ProductionStageStatus }
        : {}),
    }

    const stages = await prisma.productionStage.findMany({
      where,
      orderBy: {
        startDate: 'desc',
      },
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
    })

    return NextResponse.json(stages)
  } catch (error) {
    console.error('Error in GET /api/production/stages:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
