import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

const statusColors: Record<string, string> = {
  // Order statuses
  PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  IN_PRODUCTION: 'bg-blue-100 text-blue-800 border-blue-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  CANCELLED: 'bg-red-100 text-red-800 border-red-200',
  
  // Production stages
  DESIGN: 'bg-purple-100 text-purple-800 border-purple-200',
  CUTTING: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  ASSEMBLY: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  TESTING: 'bg-teal-100 text-teal-800 border-teal-200',
  
  // Inventory types
  RAW: 'bg-orange-100 text-orange-800 border-orange-200',
  COMPONENT: 'bg-pink-100 text-pink-800 border-pink-200',
  
  // Product types
  NEON: 'bg-violet-100 text-violet-800 border-violet-200',
  LED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  
  // Generic statuses
  ACTIVE: 'bg-green-100 text-green-800 border-green-200',
  DISCONTINUED: 'bg-gray-100 text-gray-800 border-gray-200',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200',
        className
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}
