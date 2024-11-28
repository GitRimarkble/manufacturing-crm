import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { orderCreateSchema } from '@/lib/validations/order'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await req.json()
    const body = orderCreateSchema.parse(json)

    // Create order with associated products in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Get product prices first
      const products = await tx.product.findMany({
        where: {
          id: {
            in: body.orderProducts.map(p => p.productId)
          },
          deleted: false
        },
        select: {
          id: true,
          price: true
        }
      })

      if (products.length !== body.orderProducts.length) {
        throw new Error('Some products not found or have been deleted')
      }

      // Create the order
      const newOrder = await tx.order.create({
        data: {
          customerId: body.customerId,
          totalAmount: body.totalAmount,
          status: body.status || 'PENDING',
          deleted: false,
        },
      })

      // Create order products with prices
      await tx.orderProduct.createMany({
        data: body.orderProducts.map((product) => {
          const productPrice = products.find(p => p.id === product.productId)?.price
          if (!productPrice) {
            throw new Error(`Price not found for product ${product.productId}`)
          }
          
          return {
            orderId: newOrder.id,
            productId: product.productId,
            quantity: product.quantity,
            price: productPrice,
            deleted: false,
          }
        }),
      })

      // Create initial production stage
      await tx.productionStage.create({
        data: {
          name: 'Initial Design',
          description: 'Initial design phase of the order',
          orderId: newOrder.id,
          status: 'PLANNED',
          startDate: new Date(),
          deleted: false,
        },
      })

      // Return the complete order with all relations
      return tx.order.findUnique({
        where: { id: newOrder.id },
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
            include: {
              tasks: true,
            },
          },
        },
      })
    })

    if (!order) {
      return new NextResponse('Failed to create order', { status: 500 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error in POST /api/orders:', error)
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
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    const where = {
      deleted: false,
      ...(status && ['PENDING', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'].includes(status) 
        ? { status: status as 'PENDING' | 'IN_PRODUCTION' | 'COMPLETED' | 'CANCELLED' } 
        : {}),
      ...(customerId ? { customerId: parseInt(customerId) } : {}),
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
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
            },
          },
        },
      },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error in GET /api/orders:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
