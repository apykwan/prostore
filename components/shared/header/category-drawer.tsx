import Link from 'next/link';
import { MenuIcon } from 'lucide-react';
import { 
  Drawer, 
  DrawerTrigger, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerClose 
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

import { getAllCategories } from '@/lib/actions/product.actions';

export default async function CategoryDrawer() {
  const categories = await getAllCategories();
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
          <div className="space-y-1 mt-4">
            {categories.map(x => (
              <Button key={x.category} variant="ghost" className="w-full justify-start" asChild>
                <DrawerClose asChild>
                  <Link href={`/search?category=${x.category}`}>
                    <span className="text-lg text-gray-800 font-extrabold">{x.category}</span>
                    <span className="text-lg text-rose-600">{x._count}</span>
                  </Link>
                </DrawerClose>
              </Button>
            ))}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}