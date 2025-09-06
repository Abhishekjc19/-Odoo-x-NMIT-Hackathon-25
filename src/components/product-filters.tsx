
"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { getProducts } from '@/lib/data';
import Link from 'next/link';

export function ProductFilters({ categories }: { categories: Array<Product['category']> }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (query.length > 1) {
      const recommendedProducts = getProducts({ search: query });
      setSuggestions(recommendedProducts.slice(0, 5)); // Show top 5 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setShowSuggestions(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    setShowSuggestions(false);
    router.push(`/?${params.toString()}`);
};

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
        <div ref={searchContainerRef} className="relative w-full md:w-1/3">
            <form onSubmit={handleSearch} className="relative w-full">
                <Input
                    type="search"
                    placeholder="Search for items..."
                    className="h-12 text-md pl-6 pr-14"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(query.length > 1)}
                />
                <Button type="submit" size="icon" variant="ghost" className="absolute top-0 right-0 h-full w-14">
                    <Search className="h-6 w-6" />
                </Button>
            </form>
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-card border rounded-md shadow-lg mt-1 z-20">
                    <ul>
                        {suggestions.map(product => (
                            <li key={product.id} className="border-b last:border-b-0">
                                <Link href={`/products/${product.id}`} className="block p-3 hover:bg-accent" onClick={() => setShowSuggestions(false)}>
                                    {product.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
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
