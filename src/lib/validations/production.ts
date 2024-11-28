import { z } from 'zod'

export const productionStageSchema = z.object({
  name: z.string().min(1, 'Stage name is required'),
  orderId: z.string().or(z.number()).transform(val => 
    typeof val === 'string' ? parseInt(val) : val
  ),
  startDate: z.date().or(z.string().transform(val => new Date(val))),
  endDate: z.date().or(z.string().transform(val => new Date(val))).nullable(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED']),
  description: z.string().optional(),
})

export type ProductionStageFormData = z.infer<typeof productionStageSchema>

export const taskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  assignedTo: z.number().optional(),
  dueDate: z.date().or(z.string().transform(val => new Date(val))).optional(),
  stageId: z.string().or(z.number()).transform(val => 
    typeof val === 'string' ? parseInt(val) : val
  ),
})

export type TaskFormData = z.infer<typeof taskSchema>
