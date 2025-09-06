"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductsByUserId, deleteProduct as deleteProductData } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/lib/types";

export default function MyListingsPage() {
  const { isLoggedIn, user, isLoading } = useAuth();
  const router = useRouter();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  useEffect(() => {
    if (user) {
      setMyProducts(getProductsByUserId(user.email)); // Mock: using email as ID
    }
  }, [user]);

  const handleDelete = (productId: string) => {
    if (!user) return;
    const success = deleteProductData(productId, user.email);
    if (success) {
        setMyProducts(prev => prev.filter(p => p.id !== productId));
        toast({ title: "Product Deleted", description: "Your listing has been successfully removed." });
    } else {
        toast({ variant: "destructive", title: "Error", description: "Could not delete the product." });
    }
  };

  if (isLoading || !isLoggedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-headline mb-8">My Listings</h1>
      {myProducts.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-lg">
          <h2 className="text-2xl font-headline mb-4">You haven't listed any items yet.</h2>
          <Button asChild>
            <Link href="/add-product">List an Item</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {myProducts.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" asChild>
                    <Link href={`/add-product?edit=${product.id}`}><Edit className="h-4 w-4" /></Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your product listing.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(product.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
