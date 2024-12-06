import { User, ProductionStage, Task, Order, Product, Inventory } from '@prisma/client'

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type UserSelect = {
  id: number
  name: string | null
  email: string
}

export type ProductionStageWithRelations = ProductionStage & {
  tasks: Array<Task & {
    assignedTo?: UserSelect | null
    productionStage?: ProductionStage
  }>
}

export type TaskWithRelations = Task & {
  assignedTo?: UserSelect | null
  productionStage?: ProductionStage
}

export type OrderWithRelations = Order & {
  productionStages?: ProductionStage[]
  products?: Product[]
}

export type InventoryWithRelations = Inventory & {
  product: Product
}

// Request validation types
export type CreateTaskRequest = {
  title: string
  description?: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  assignedToId?: number
  productionStageId: number
  dueDate?: Date
}

export type UpdateTaskRequest = Partial<CreateTaskRequest>

export type CreateProductionStageRequest = {
  name: string
  description?: string
  orderNumber: number
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED'
  startDate: Date
  endDate?: Date
}

export type UpdateProductionStageRequest = Partial<CreateProductionStageRequest>
