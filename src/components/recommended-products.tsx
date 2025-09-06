"use client";

import { useEffect, useState } from 'react';
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-product-recommendations';
import type { Product } from '@/lib/types';
import { getProductById } from '@/lib/data';
import { ProductCard } from './product-card';
import { Skeleton } from '@/components/ui/skeleton';

export function RecommendedProducts() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      setIsLoading(true);
      try {
        const browsingHistoryJSON = localStorage.getItem('browsingHistory');
        const browsingHistory = browsingHistoryJSON ? JSON.parse(browsingHistoryJSON) : [];
        
        // Don't fetch if there's no history
        if(browsingHistory.length === 0) {
            setRecommendations([]);
            return;
        }

        const result = await getPersonalizedRecommendations({
          userId: 'mock-user-123',
          browsingHistory: browsingHistory.slice(-5), // Use last 5 viewed products
        });

        if (result.productIds) {
            const recommendedProducts = result.productIds
              .map(id => getProductById(id))
              .filter((p): p is Product => p !== undefined);
            
            setRecommendations(recommendedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-16">
        <h2 className="text-3xl font-headline mb-6 text-center">Recommended For You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
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
    );
  }

  if (recommendations.length === 0) {
    return null; // Don't show the section if there are no recommendations
  }

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-headline mb-6 text-center">Recommended For You</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {recommendations.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
