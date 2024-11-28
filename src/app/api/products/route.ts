import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productCreateSchema } from '@/lib/validations/product'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const json = await req.json()
    const body = productCreateSchema.parse(json)

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        price: body.price,
        materialCost: body.materialCost,
        laborCost: body.laborCost,
        status: body.status,
        stock: body.stock,
        deleted: false,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error in POST /api/products:', error)
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
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const lowStock = searchParams.get('lowStock')
    const search = searchParams.get('search')

    const where = {
      deleted: false,
      ...(type && ['NEON', 'LED'].includes(type) ? { type: type as 'NEON' | 'LED' } : {}),
      ...(status && ['ACTIVE', 'DISCONTINUED'].includes(status) 
        ? { status: status as 'ACTIVE' | 'DISCONTINUED' } 
        : {}),
      ...(lowStock === 'true' ? { stock: { lte: 10 } } : {}),
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        price: true,
        materialCost: true,
        laborCost: true,
        status: true,
        stock: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error in GET /api/products:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
