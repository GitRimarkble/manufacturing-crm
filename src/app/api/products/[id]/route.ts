import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productUpdateSchema } from '@/lib/validations/product'
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

    const productId = parseInt(params.id)
    if (isNaN(productId)) {
      return new NextResponse('Invalid product ID', { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { 
        id: productId,
        deleted: false,
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
        orderProducts: {
          where: {
            deleted: false,
          },
          select: {
            id: true,
            quantity: true,
            price: true,
            order: {
              select: {
                id: true,
                status: true,
                customer: {
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

    if (!product) {
      return new NextResponse('Product not found', { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error in GET /api/products/[id]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const productId = parseInt(params.id)
    if (isNaN(productId)) {
      return new NextResponse('Invalid product ID', { status: 400 })
    }

    const json = await req.json()
    const body = productUpdateSchema.parse(json)

    // If updating costs, recalculate price with markup
    const price = (body.materialCost !== undefined || body.laborCost !== undefined) 
      ? await prisma.product.findUnique({
          where: { id: productId },
          select: { materialCost: true, laborCost: true },
        }).then(current => {
          const newMaterialCost = body.materialCost ?? current?.materialCost ?? 0
          const newLaborCost = body.laborCost ?? current?.laborCost ?? 0
          return (newMaterialCost + newLaborCost) * 1.3
        })
      : undefined

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...body,
        price: body.price ?? price,
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

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error in PATCH /api/products/[id]:', error)
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

    const productId = parseInt(params.id)
    if (isNaN(productId)) {
      return new NextResponse('Invalid product ID', { status: 400 })
    }

    await prisma.product.update({
      where: { id: productId },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/products/[id]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
