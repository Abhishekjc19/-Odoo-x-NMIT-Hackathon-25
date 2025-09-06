import { Leaf } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-2xl font-bold font-headline text-primary", className)}>
      <Leaf className="h-7 w-7" />
      <span>EcoSwap</span>
    </Link>
  );
}
