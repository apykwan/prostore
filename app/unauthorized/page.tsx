import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Unauthorized Access'
};

export default function Unauthorized() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)]">
      <div className="h1-hold text-4xl">Unauthorized Access</div>
      <p className="text-muted-foreground">
        You do not have the permission to access this page
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}