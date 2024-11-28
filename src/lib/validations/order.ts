import { z } from 'zod'

const orderProductSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  customization: z.string().optional(),
})

export const orderCreateSchema = z.object({
  customerId: z.number().int().positive(),
  totalAmount: z.number().min(0),
  status: z.enum(['PENDING', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED']).default('PENDING'),
  orderProducts: z.array(orderProductSchema),
})

export const orderUpdateSchema = z.object({
  status: z.enum(['PENDING', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED']),
  totalAmount: z.number().min(0).optional(),
})

export type OrderCreate = z.infer<typeof orderCreateSchema>
export type OrderUpdate = z.infer<typeof orderUpdateSchema>
export type OrderProduct = z.infer<typeof orderProductSchema>
