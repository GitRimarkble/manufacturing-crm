import { useState } from 'react'
import { ApiResponse } from '@/lib/api-utils'

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
}

export function useApi<T = any>() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = async (
    url: string,
    options?: RequestInit & UseApiOptions<T>
  ): Promise<T | null> => {
    const { onSuccess, onError, ...fetchOptions } = options || {}
    
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions?.headers,
        },
      })

      const data: ApiResponse<T> = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'An error occurred')
      }

      if (data.data && onSuccess) {
        onSuccess(data.data)
      }

      return data.data || null
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      if (onError) {
        onError(message)
      }
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    request,
  }
}

// Helper functions for common API operations
export function useApiMutation<T = any, B = any>() {
  const { request, ...rest } = useApi<T>()

  const mutate = async (url: string, body: B, options?: UseApiOptions<T>) => {
    return request(url, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    })
  }

  return {
    mutate,
    ...rest,
  }
}

export function useApiQuery<T = any>() {
  const { request, ...rest } = useApi<T>()

  const query = async (url: string, options?: UseApiOptions<T>) => {
    return request(url, {
      method: 'GET',
      ...options,
    })
  }

  return {
    query,
    ...rest,
  }
}
