import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { orderUpdateSchema } from '@/lib/validations/order'
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

    const orderId = parseInt(params.id)
    if (isNaN(orderId)) {
      return new NextResponse('Invalid order ID', { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { 
        id: orderId,
        deleted: false,
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        orderProducts: {
          where: {
            deleted: false,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                type: true,
                price: true,
              },
            },
          },
        },
        productionStages: {
          where: {
            deleted: false,
          },
          orderBy: {
            createdAt: 'desc',
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
            },
          },
        },
      },
    })

    if (!order) {
      return new NextResponse('Order not found', { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error in GET /api/orders/[id]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const orderId = parseInt(params.id)
    if (isNaN(orderId)) {
      return new NextResponse('Invalid order ID', { status: 400 })
    }

    const json = await req.json()
    const validatedData = orderUpdateSchema.parse(json)

    const order = await prisma.order.update({
      where: { id: orderId },
      data: validatedData,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        orderProducts: {
          where: {
            deleted: false,
          },
          include: {
            product: {
              select: {
                id: true,
                name: true,
                type: true,
                price: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error in PATCH /api/orders/[id]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const orderId = parseInt(params.id)
    if (isNaN(orderId)) {
      return new NextResponse('Invalid order ID', { status: 400 })
    }

    // Soft delete the order and its related records
    await prisma.$transaction([
      // Update order products
      prisma.orderProduct.updateMany({
        where: { orderId },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      }),
      // Update production stages
      prisma.productionStage.updateMany({
        where: { orderId },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      }),
      // Update tasks in production stages
      prisma.task.updateMany({
        where: {
          productionStage: {
            orderId,
          },
        },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      }),
      // Update the order itself
      prisma.order.update({
        where: { id: orderId },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      }),
    ])

    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/orders/[id]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
