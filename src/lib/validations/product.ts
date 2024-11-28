import { z } from 'zod'

export const productCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  type: z.enum(['NEON', 'LED']),
  materialCost: z.number().min(0, 'Material cost must be non-negative'),
  laborCost: z.number().min(0, 'Labor cost must be non-negative'),
  price: z.number().min(0, 'Price must be non-negative'),
  status: z.enum(['ACTIVE', 'DISCONTINUED']).default('ACTIVE'),
  stock: z.number().int().min(0, 'Stock must be non-negative').default(0),
}).transform(data => ({
  ...data,
  // If price is not provided, calculate it from costs with a markup
  price: data.price || (data.materialCost + data.laborCost) * 1.3,
}))

export const productUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  type: z.enum(['NEON', 'LED']).optional(),
  materialCost: z.number().min(0, 'Material cost must be non-negative').optional(),
  laborCost: z.number().min(0, 'Labor cost must be non-negative').optional(),
  price: z.number().min(0, 'Price must be non-negative').optional(),
  status: z.enum(['ACTIVE', 'DISCONTINUED']).optional(),
  stock: z.number().int().min(0, 'Stock must be non-negative').optional(),
})

export type ProductCreate = z.infer<typeof productCreateSchema>
export type ProductUpdate = z.infer<typeof productUpdateSchema>
