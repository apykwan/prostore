'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formUrlQuery } from '@/lib/utils';

type PaginiationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
}

export default function Pagination({ page, totalPages, urlParamName }: PaginiationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleClick(btnType: string) {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1; 
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString()
    });

    router.push(newUrl);
  }

  return (
    <div className="flex gap-2">
      <Button 
        size="lg" 
        variant="outline" 
        className="w-28" 
        disabled={Number(page) <= 1} onClick={() => handleClick('prev')}
      >
        Previous
      </Button>

      <Button 
        size="lg" 
        variant="outline" 
        className="w-28" 
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick('next')}
      >
        Next
      </Button>
    </div>
  );
}