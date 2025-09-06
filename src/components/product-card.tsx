import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Card className={cn("overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:border-primary/50 bg-card/60", className)}>
      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={600}
              height={400}
              data-ai-hint={product.dataAiHint}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline leading-tight mb-2 group-hover:text-primary transition-colors">
            {product.title}
          </CardTitle>
          <Badge variant="secondary" className="mb-2">{product.category}</Badge>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>
        </CardFooter>
      </Link>
    </Card>
  );
}
