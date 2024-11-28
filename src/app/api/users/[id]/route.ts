import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { userUpdateSchema } from '@/lib/validations/user'
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

    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return successResponse(user)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized')
    }

    const json = await req.json()
    const body = userUpdateSchema.parse(json)

    const user = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: body,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    return successResponse(user)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      throw new Error('Unauthorized')
    }

    await prisma.user.delete({
      where: { id: parseInt(params.id) },
    })

    return successResponse({ message: 'User deleted successfully' })
  } catch (error) {
    return handleApiError(error)
  }
}
