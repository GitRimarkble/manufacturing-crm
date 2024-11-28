import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productionStageSchema } from '@/lib/validations/production'
import { successResponse, handleApiError } from '@/lib/api-utils'
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
      throw new Error('Unauthorized')
    }

    const stage = await prisma.productionStage.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        tasks: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!stage) {
      throw new Error('Production stage not found')
    }

    return successResponse(stage)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      throw new Error('Unauthorized')
    }

    const json = await req.json()
    const body = productionStageSchema.parse(json)

    const stage = await prisma.productionStage.findUnique({
      where: { id: parseInt(params.id) },
    })

    if (!stage) {
      throw new Error('Production stage not found')
    }

    const updatedStage = await prisma.productionStage.update({
      where: { id: parseInt(params.id) },
      data: body,
      include: {
        order: {
          include: {
            customer: true,
          },
        },
        tasks: true,
      },
    })

    return successResponse(updatedStage)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
      throw new Error('Unauthorized')
    }

    await prisma.productionStage.delete({
      where: { id: parseInt(params.id) },
    })

    return successResponse({ message: 'Production stage deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
