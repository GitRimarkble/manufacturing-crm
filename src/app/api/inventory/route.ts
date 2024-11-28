import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { materialInventoryCreateSchema } from '@/lib/validations/inventory'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MaterialType } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const validatedData = materialInventoryCreateSchema.parse(body)

    const material = await prisma.materialInventory.create({
      data: validatedData,
    })

    return NextResponse.json(material)
  } catch (error) {
    console.error('Error in POST /api/inventory:', error)
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
    const typeParam = searchParams.get('type')
    const lowStock = searchParams.get('lowStock') === 'true'

    const where: any = {
      deleted: false,
    }

    if (typeParam && Object.values(MaterialType).includes(typeParam as MaterialType)) {
      where.type = typeParam as MaterialType
    }

    if (lowStock) {
      where.quantity = {
        lte: {
          path: ['reorderPoint'],
        },
      }
    }

    const materials = await prisma.materialInventory.findMany({
      where,
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    return NextResponse.json(materials)
  } catch (error) {
    console.error('Error in GET /api/inventory:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
