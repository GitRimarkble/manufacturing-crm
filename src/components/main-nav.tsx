'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const items = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Production',
    href: '/dashboard/production',
  },
  {
    title: 'Orders',
    href: '/dashboard/orders',
  },
  {
    title: 'Inventory',
    href: '/dashboard/inventory',
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-6 lg:space-x-8">
      <Link
        href="/dashboard"
        className="hidden font-bold sm:inline-block"
      >
        Manufacturing
      </Link>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href
              ? 'text-black dark:text-white'
              : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
