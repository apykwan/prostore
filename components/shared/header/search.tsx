import { SearchIcon } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { getAllCategories } from '@/lib/actions/product.actions';

export default async function Search() {
  const categories = await getAllCategories();
  return (
    <form action="/search" method="GET">
      <div className='flex w-full max-w-sm items-center space-x-2'>
        <Select name='category'>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='All' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key='All' value='all'>
              All
            </SelectItem>
            {categories.map((x) => (
              <SelectItem key={x.category} value={x.category}>
                {x.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name='q'
          type='text'
          spellCheck={false}
          placeholder='Search...'
          className='md:w-[100px] lg:w-[300px]'
        />
        <Button>
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
}