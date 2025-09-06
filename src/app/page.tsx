
"use client";

import { ProductFilters } from '@/components/product-filters';
import { ProductCard } from '@/components/product-card';
import { getProducts, getCategories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { RecommendedProducts } from '@/components/recommended-products';
import { Suspense } from 'react';
import type { Product } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function SearchBarSection() {
    const categories = getCategories();
    return (
        <section className="relative -mt-16 mb-12 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="shadow-lg">
                    <CardContent className="p-6">
                        <ProductFilters categories={categories} />
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

function HomePageContent() {
  const { isLoggedIn, user } = useAuth();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || undefined;
  const categoryQuery = (searchParams.get('category') || 'All') as Product['category'] | 'All';
  
  const products = getProducts({ search: searchQuery, category: categoryQuery });

  return (
    <>
      {isLoggedIn && user?.displayName && (
        <div className="text-center mb-12 mt-12">
          <h2 className="text-3xl font-headline font-bold mb-2">Welcome back, {user.displayName}!</h2>
        </div>
      )}
      
      <h2 className="text-3xl font-headline mb-6 text-center">Recent Listings</h2>
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

      <RecommendedProducts />
    </>
  );
}

function PageSkeleton() {
    return (
        <div className="space-y-12 mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-16">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-2/5" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="relative h-[50vh] bg-cover bg-center flex items-center justify-center text-white -mx-4 sm:-mx-6 lg:-mx-8">
          <Image 
            src="https://picsum.photos/seed/hero/1600/800" 
            alt="Eco-friendly products" 
            fill={true}
            className="z-0 object-cover"
            data-ai-hint="community sharing"
            priority
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="relative z-20 text-center px-4">
              <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">Trade, Don't Trash</h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">Join the movement. Buy, sell, and swap pre-loved goods with a like-minded community.</p>
          </div>
      </section>
      
      <SearchBarSection />
      
      <Suspense fallback={<PageSkeleton />}>
        <HomePageContent />
      </Suspense>
      

      <section id="about" className="py-16 bg-secondary/50 mt-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl font-headline font-bold mb-4">About EcoSwap</h2>
            <p className="max-w-3xl mx-auto text-muted-foreground">
                EcoSwap is a community-driven marketplace dedicated to promoting sustainability through the buying, selling, and swapping of pre-loved goods. Our mission is to reduce waste, extend the life of products, and build a community that values conscious consumption. Join us in making a positive impact, one swap at a time.
            </p>
        </div>
      </section>

      <section id="contact" className="py-16">
          <div className="container mx-auto text-center">
              <h2 className="text-3xl font-headline font-bold mb-4">Get In Touch</h2>
              <p className="max-w-xl mx-auto text-muted-foreground mb-8">
                  Have questions, feedback, or just want to say hello? We'd love to hear from you.
              </p>
              <Button size="lg" asChild>
                  <a href="mailto:support@ecoswap.com">Contact Us</a>
              </Button>
          </div>
      </section>


      <Link href="/add-product" passHref>
        <Button
          className="fixed bottom-24 right-4 h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
          size="icon"
          aria-label="Add new product"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </Link>
    </div>
  );
}

