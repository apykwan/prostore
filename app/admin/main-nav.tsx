'use client';

import { type HTMLAttributes } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  {
    title: 'Overview',
    href: '/admin/overview'
  },
  {
    title: 'Products',
    href: '/admin/products'
  },
  {
    title: 'Orders',
    href: '/admin/orders'
  },
  {
    title: 'Users',
    href: '/admin/users'
  }
];
export default function MainNav({ className, ...props }: HTMLAttributes<HTMLElement> ) {
  const pathname = usePathname();
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} { ...props }>
      { links.map((item) => (
        <Link key={item.href} href={item.href} className={
          cn('text-sm font-extrabold transition-colors hover:text-primary', pathname.includes(item.href) ? '' : 'text-muted-foreground')}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}