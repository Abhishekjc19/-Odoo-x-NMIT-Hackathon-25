"use client";

import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h1 className="text-4xl font-headline mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="flex items-center p-4">
                <Image src={item.imageUrl} alt={item.title} width={100} height={100} className="rounded-md object-cover" data-ai-hint={item.dataAiHint} />
                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="font-bold text-primary mt-1">${item.price.toFixed(2)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Checkout</Button>
                <Button variant="outline" className="w-full" onClick={clearCart}>Clear Cart</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
