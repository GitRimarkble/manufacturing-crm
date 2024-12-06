import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { TaskStatus } from '@prisma/client';

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
    const { orderProducts, ...orderData } = json;

    // Create the order and its products in a transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          ...orderData,
          orderProducts: {
            create: orderProducts.map((op: any) => ({
              productId: op.productId,
              quantity: op.quantity,
              price: op.price,
              customization: op.customization,
            })),
          },
        },
      });

      // Get all production stages
      const stages = await tx.productionStage.findMany({
        where: { deleted: false },
        orderBy: { orderNumber: 'asc' },
      });

      // Create tasks for each production stage
      for (const stage of stages) {
        await tx.task.create({
          data: {
            title: `${stage.name} for Order #${order.id}`,
            description: `Complete ${stage.name.toLowerCase()} phase`,
            status: TaskStatus.TODO,
            productionStageId: stage.id,
            orderId: order.id,
          },
        });
      }

      return order;
    });

    // Return the created order with its relations
    const orderWithRelations = await prisma.order.findUnique({
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
                description: true,
                price: true,
              },
            },
          },
        },
        tasks: {
          include: {
            productionStage: true,
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

    return NextResponse.json(orderWithRelations);
  } catch (error) {
    console.error('Error creating order:', error);
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');

    const where: any = {
      deleted: false,
    };

    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = parseInt(customerId);
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
                description: true,
                price: true,
              },
            },
          },
        },
        tasks: {
          where: {
            deleted: false,
          },
          include: {
            productionStage: true,
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

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
