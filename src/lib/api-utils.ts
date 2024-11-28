import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
}

export function successResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
  })
}

export function errorResponse(error: string | Error | ZodError, status = 400): NextResponse<ApiResponse> {
  let message = 'An unexpected error occurred'

  if (typeof error === 'string') {
    message = error
  } else if (error instanceof ZodError) {
    message = error.errors.map(e => e.message).join(', ')
  } else if (error instanceof Error) {
    message = error.message
  }

  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  )
}

export async function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof ZodError) {
    return errorResponse(error)
  }
  
  if (error instanceof Error) {
    return errorResponse(error.message)
  }
  
  return errorResponse('An unexpected error occurred')
}
