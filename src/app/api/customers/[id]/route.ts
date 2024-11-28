import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { customerUpdateSchema } from '@/lib/validations/customer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const customerId = parseInt(params.id)
    if (isNaN(customerId)) {
      return new NextResponse('Invalid customer ID', { status: 400 })
    }

    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
      include: {
        orders: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    })

    if (!customer) {
      return new NextResponse('Customer not found', { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error in GET /api/customers/[id]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const customerId = parseInt(params.id)
    if (isNaN(customerId)) {
      return new NextResponse('Invalid customer ID', { status: 400 })
    }

    const body = await req.json()
    const validatedData = customerUpdateSchema.parse(body)

    const customer = await prisma.customer.update({
      where: {
        id: customerId,
      },
      data: validatedData,
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error in PATCH /api/customers/[id]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const customerId = parseInt(params.id)
    if (isNaN(customerId)) {
      return new NextResponse('Invalid customer ID', { status: 400 })
    }

    // Check if customer exists and has orders
    const orderCount = await prisma.order.count({
      where: {
        customerId: customerId,
      },
    })

    if (orderCount > 0) {
      return new NextResponse('Cannot delete customer with existing orders', { status: 400 })
    }

    await prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/customers/[id]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
