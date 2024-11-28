'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { IconType } from 'react-icons'
import {
  HiOutlineHome,
  HiOutlineShoppingCart,
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineClipboardList,
  HiOutlineChartBar,
} from 'react-icons/hi'

interface NavItem {
  name: string
  href: string
  icon: IconType
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HiOutlineHome },
  { name: 'Orders', href: '/dashboard/orders', icon: HiOutlineShoppingCart },
  { name: 'Customers', href: '/dashboard/customers', icon: HiOutlineUsers },
  { name: 'Products', href: '/dashboard/products', icon: HiOutlineCube },
  { name: 'Production', href: '/dashboard/production', icon: HiOutlineClipboardList },
  { name: 'Reports', href: '/dashboard/reports', icon: HiOutlineChartBar },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
            <h1 className="text-xl font-bold text-white">MMS</h1>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 bg-gray-800 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                      ${isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        mr-3 flex-shrink-0 h-6 w-6
                        ${isActive
                          ? 'text-gray-300'
                          : 'text-gray-400 group-hover:text-gray-300'
                        }
                      `}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
