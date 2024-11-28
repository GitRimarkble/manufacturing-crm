import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { customerCreateSchema } from '@/lib/validations/customer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Prisma } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const validatedData = customerCreateSchema.parse(body)

    const customer = await prisma.customer.create({
      data: validatedData,
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error in POST /api/customers:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query')

    let where: Prisma.CustomerWhereInput = {
      deleted: false,
    }

    if (query) {
      where = {
        ...where,
        OR: [
          { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: query, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error in GET /api/customers:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
