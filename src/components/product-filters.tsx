"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

export function ProductFilters({ categories }: { categories: Array<Product['category']> }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';

  const handleFilter = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      <Button
        variant={currentCategory === 'All' ? 'default' : 'outline'}
        onClick={() => handleFilter('All')}
        className={cn(currentCategory === 'All' && 'bg-primary text-primary-foreground')}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={currentCategory === category ? 'default' : 'outline'}
          onClick={() => handleFilter(category)}
          className={cn(currentCategory === category && 'bg-primary text-primary-foreground')}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
