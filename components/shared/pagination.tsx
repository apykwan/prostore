'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type PaginiationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
}

export default function Pagination({ page, totalPages, urlParamName }: PaginiationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <>Pagination</>
  );
}