import { z } from 'zod'

export const materialInventoryCreateSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(['RAW', 'COMPONENT', 'PACKAGING']),
  quantity: z.number().int().min(0),
  unit: z.string(),
  reorderPoint: z.number().int().min(0),
  supplierId: z.number().int().positive(),
})

export const materialInventoryUpdateSchema = materialInventoryCreateSchema.partial()

export type MaterialInventoryCreate = z.infer<typeof materialInventoryCreateSchema>
export type MaterialInventoryUpdate = z.infer<typeof materialInventoryUpdateSchema>
