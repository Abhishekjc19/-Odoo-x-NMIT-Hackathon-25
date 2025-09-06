"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function ProductFilters({ categories }: { categories: Array<Product['category']> }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';
  const [query, setQuery] = useState(searchParams.get('search') || '');


  const handleFilter = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
        params.set('search', query);
    } else {
        params.delete('search');
    }
    router.push(`${pathname}?${params.toString()}`);
};

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
        <form onSubmit={handleSearch} className="relative w-full md:w-1/3">
            <Input
                type="search"
                placeholder="Search for items..."
                className="h-12 text-md pl-6 pr-14"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" size="icon" variant="ghost" className="absolute top-0 right-0 h-full w-14">
                <Search className="h-6 w-6" />
            </Button>
        </form>
        <div className="flex flex-wrap justify-center gap-2">
            <Button
                variant={currentCategory === 'All' ? 'default' : 'ghost'}
                onClick={() => handleFilter('All')}
                className={cn('rounded-full', currentCategory === 'All' && 'bg-primary text-primary-foreground')}
            >
                All
            </Button>
            {categories.map((category) => (
                <Button
                key={category}
                variant={currentCategory === category ? 'default' : 'ghost'}
                onClick={() => handleFilter(category)}
                className={cn('rounded-full', currentCategory === category && 'bg-primary text-primary-foreground')}
                >
                {category}
                </Button>
            ))}
        </div>
    </div>
  );
}
