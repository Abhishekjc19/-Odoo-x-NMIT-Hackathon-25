"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import Link from 'next/link';

const mockPurchases = [
  { id: 'p1', title: 'Ergonomic Office Chair', price: 250, date: '2023-09-15', imageUrl: 'https://picsum.photos/seed/chair/100/100' },
  { id: 'p2', title: 'Mechanical Keyboard', price: 95, date: '2023-09-20', imageUrl: 'https://picsum.photos/seed/keyboard/100/100' },
  { id: 'p3', title: 'Set of Classic Sci-Fi Novels', price: 45, date: '2023-10-01', imageUrl: 'https://picsum.photos/seed/scifi/100/100' },
];

export default function PurchasesPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading || !isLoggedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-headline mb-8">Previous Purchases</h1>
      {mockPurchases.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">No purchase history.</h2>
            <p className="text-muted-foreground">Looks like you haven't bought anything yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {mockPurchases.map((item) => (
            <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Image src={item.imageUrl} alt={item.title} width={80} height={80} className="rounded-md object-cover" />
                        <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">Purchased on {item.date}</p>
                        </div>
                    </div>
                    <p className="font-bold text-lg text-primary">${item.price.toFixed(2)}</p>
                </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
