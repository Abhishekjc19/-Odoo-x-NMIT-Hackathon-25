import { ProductFilters } from '@/components/product-filters';
import { ProductCard } from '@/components/product-card';
import { getProducts, getCategories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { RecommendedProducts } from '@/components/recommended-products';
import { Suspense } from 'react';
import type { Product } from '@/lib/types';

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const searchQuery = typeof searchParams?.search === 'string' ? searchParams.search : undefined;
  const categoryQuery = (typeof searchParams?.category === 'string' ? searchParams.category : 'All') as Product['category'] | 'All';
  
  const products = getProducts({ search: searchQuery, category: categoryQuery });
  const categories = getCategories();

  return (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Discover Sustainable Finds</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Your marketplace for pre-loved treasures. Join our community and embrace the circular economy.</p>
      </div>
      
      <ProductFilters categories={categories} />
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg">
          <h2 className="text-2xl font-headline mb-4">No Products Found</h2>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}

      <Suspense fallback={<div>Loading recommendations...</div>}>
        <RecommendedProducts />
      </Suspense>

      <Link href="/add-product" passHref>
        <Button
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg bg-accent hover:bg-accent/90 text-accent-foreground"
          size="icon"
          aria-label="Add new product"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </Link>
    </>
  );
}
