import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
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
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return new NextResponse(JSON.stringify({ error: 'Invalid ID' }), { status: 400 })
    }

    const material = await prisma.materialInventory.findUnique({
      where: {
        id,
        deleted: false,
      }
    })

    if (!material) {
      return new NextResponse(JSON.stringify({ error: 'Material not found' }), { status: 404 })
    }

    return NextResponse.json(material)
  } catch (error) {
    console.error('Error fetching material:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return new NextResponse(JSON.stringify({ error: 'Invalid ID' }), { status: 400 })
    }

    const json = await req.json()
    const material = await prisma.materialInventory.update({
      where: {
        id,
        deleted: false,
      },
      data: json,
    })

    return NextResponse.json(material)
  } catch (error) {
    console.error('Error updating material:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return new NextResponse(JSON.stringify({ error: 'Invalid ID' }), { status: 400 })
    }

    const material = await prisma.materialInventory.update({
      where: {
        id,
        deleted: false,
      },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    })

    return NextResponse.json(material)
  } catch (error) {
    console.error('Error deleting material:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
