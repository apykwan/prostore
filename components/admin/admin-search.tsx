'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Input } from '../ui/input';

export default function AdminSearch() {
  const pathname = usePathname();
  const formActionUrl = pathname.includes('/admin/orders')
    ? '/admin/orders'
    : pathname.includes('/admin/users')
      ? '/admin/users'
      : '/admin/products';

  const searchParams = useSearchParams();

  // Track if the component has mounted to avoid SSR mismatch
  const [mounted, setMounted] = useState(false);
  const [queryValue, setQueryValue] = useState('');

  useEffect(() => {
    setMounted(true);
    setQueryValue(searchParams.get('query') || '');
  }, [searchParams]);

  if (!mounted) return null;
  return (
    <form action={formActionUrl} method="GET">
      <Input 
        type="search"
        placeholder="Search..."
        name="query"
        value={queryValue}
        onChange={e => setQueryValue(e.target.value)}
        className="md:w-[100px] lg:w-[300px]"
      />
      <button className="sr-only" type="submit">Search</button>
    </form>
  );
}