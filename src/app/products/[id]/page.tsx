"use client";

import { useParams } from 'next/navigation';
import { getProductById } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { TrackView } from '@/components/track-view';
import { ShoppingCart } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const productId = Array.isArray(id) ? id[0] : id;

  const product = getProductById(productId);
  const { addToCart } = useCart();
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-headline">Product not found</h1>
        <p className="text-muted-foreground mt-4">We couldn't find the product you're looking for.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  return (
    <>
      <TrackView productId={productId} />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <Image
            src={product.imageUrl}
            alt={product.title}
            width={800}
            height={600}
            data-ai-hint={product.dataAiHint}
            className="w-full object-cover"
          />
        </div>
        <div className="flex flex-col h-full">
          <Badge variant="secondary" className="w-fit mb-2">{product.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-headline font-bold">{product.title}</h1>
          <p className="text-3xl font-bold text-primary my-4">${product.price.toFixed(2)}</p>
          <div className="prose prose-invert max-w-none text-muted-foreground mb-6">
            <p>{product.description}</p>
          </div>
          <div className="mt-auto">
            <Button size="lg" onClick={handleAddToCart} className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
