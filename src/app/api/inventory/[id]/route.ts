import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { materialInventoryUpdateSchema } from '@/lib/validations/inventory'
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

    const materialId = parseInt(params.id)
    if (isNaN(materialId)) {
      return new NextResponse('Invalid material ID', { status: 400 })
    }

    const material = await prisma.materialInventory.findUnique({
      where: { 
        id: materialId,
        deleted: false,
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

    if (!material) {
      return new NextResponse('Material not found', { status: 404 })
    }

    return NextResponse.json(material)
  } catch (error) {
    console.error('Error in GET /api/inventory/[id]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const materialId = parseInt(params.id)
    if (isNaN(materialId)) {
      return new NextResponse('Invalid material ID', { status: 400 })
    }

    const json = await req.json()
    const validatedData = materialInventoryUpdateSchema.parse(json)

    const updateData: any = { ...validatedData }
    if (validatedData.supplierId) {
      updateData.supplier = {
        connect: { id: validatedData.supplierId },
      }
      delete updateData.supplierId
    }

    const material = await prisma.materialInventory.update({
      where: { id: materialId },
      data: updateData,
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

    return NextResponse.json(material)
  } catch (error) {
    console.error('Error in PATCH /api/inventory/[id]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const materialId = parseInt(params.id)
    if (isNaN(materialId)) {
      return new NextResponse('Invalid material ID', { status: 400 })
    }

    await prisma.materialInventory.update({
      where: { id: materialId },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Material deleted successfully' })
  } catch (error) {
    console.error('Error in DELETE /api/inventory/[id]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
