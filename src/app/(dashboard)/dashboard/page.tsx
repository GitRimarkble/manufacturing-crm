'use client'

import { useQuery } from '@tanstack/react-query'
import {
  HiOutlineShoppingCart,
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
} from 'react-icons/hi'

interface StatCard {
  name: string
  stat: string
  icon: React.ComponentType<any>
  change: string
  changeType: 'increase' | 'decrease'
}

const stats: StatCard[] = [
  {
    name: 'Total Orders',
    stat: '71,897',
    icon: HiOutlineShoppingCart,
    change: '12%',
    changeType: 'increase',
  },
  {
    name: 'Products',
    stat: '58.16%',
    icon: HiOutlineCube,
    change: '2.1%',
    changeType: 'decrease',
  },
  {
    name: 'Customers',
    stat: '24,875',
    icon: HiOutlineUsers,
    change: '4.75%',
    changeType: 'increase',
  },
  {
    name: 'Revenue',
    stat: '$405,091.00',
    icon: HiOutlineCurrencyDollar,
    change: '54.02%',
    changeType: 'increase',
  },
]

export default function DashboardPage() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Last 30 days
      </h3>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              <p
                className={classNames(
                  item.changeType === 'increase'
                    ? 'text-green-600'
                    : 'text-red-600',
                  'ml-2 flex items-baseline text-sm font-semibold'
                )}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
