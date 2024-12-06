import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { successResponse, errorResponse, handleApiError } from '@/lib/api-utils'
import { ProductionStageWithRelations, CreateProductionStageRequest } from '@/types/api'
import { z } from 'zod'

const createStageSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  orderNumber: z.number(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED']),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return errorResponse('Insufficient permissions', 403)
    }

    const json = await req.json()
    const validatedData = createStageSchema.parse(json)

    const stage = await prisma.productionStage.create({
      data: {
        ...validatedData,
        deleted: false,
      },
    })

    return successResponse(stage)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return errorResponse('Unauthorized', 401)
    }

    const stages = await prisma.productionStage.findMany({
      where: {
        deleted: false,
      },
      orderBy: {
        orderNumber: 'asc',
      },
      include: {
        tasks: {
          where: {
            deleted: false,
          },
          include: {
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
    })

    return successResponse<ProductionStageWithRelations[]>(stages)
  } catch (error) {
    return handleApiError(error)
  }
}
