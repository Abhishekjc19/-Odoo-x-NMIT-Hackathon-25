
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addProduct, getCategories } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkles, ArrowLeft } from "lucide-react";
import { enhanceImageAction } from "@/app/actions";

const categories = getCategories();

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  category: z.enum(categories),
  price: z.coerce.number().min(0.01, "Price must be positive."),
  imageUrl: z.string().url("Must be a valid URL."),
});

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isLoggedIn, user, isLoading } = useAuth();
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string>('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      imageUrl: "",
    },
  });

  const watchedImageUrl = form.watch("imageUrl");

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);


  async function handleEnhanceImage() {
    if (!watchedImageUrl) return;
    setIsEnhancing(true);
    setEnhancedImageUrl('');
    const result = await enhanceImageAction(watchedImageUrl);
    setIsEnhancing(false);
    if (result.enhancedPhotoDataUri) {
        setEnhancedImageUrl(result.enhancedPhotoDataUri);
        toast({ title: "Image Enhanced", description: "Your product image has been improved by AI." });
    } else {
        toast({ variant: "destructive", title: "Enhancement Failed", description: result.error });
    }
  }


  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.email) return;
    
    addProduct({
        ...values,
        userId: user.email, // Using email as a mock user ID
    });

    toast({
      title: "Product Listed!",
      description: `${values.title} is now available on EcoSwap.`,
    });
    router.push("/my-listings");
  }
  
  if (isLoading || !isLoggedIn) {
      return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">List a New Item</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-8">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Title</FormLabel>
                                <FormControl><Input placeholder="e.g., Vintage Leather Jacket" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea placeholder="Describe your item in detail..." {...field} rows={5} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="category" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>

                                    </FormControl>
                                    <SelectContent>
                                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="price" render={({ field }) => (
                                <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl><Input type="number" step="0.01" placeholder="25.00" {...field} /></FormControl>
                                <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <FormField control={form.control} name="imageUrl" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4 h-48">
                            {watchedImageUrl && !form.formState.errors.imageUrl ? <div className="bg-muted rounded-md p-2 flex items-center justify-center"><Image src={watchedImageUrl} alt="Preview" width={200} height={200} className="object-contain max-h-full rounded-md" /></div> : <div />}
                            {enhancedImageUrl && <div className="bg-muted rounded-md p-2 flex items-center justify-center"><Image src={enhancedImageUrl} alt="Enhanced Preview" width={200} height={200} className="object-contain max-h-full rounded-md" /></div>}
                            {isEnhancing && <div className="bg-muted rounded-md p-2 flex items-center justify-center animate-pulse">Enhancing...</div>}
                        </div>
                        <Button type="button" variant="outline" onClick={handleEnhanceImage} disabled={!watchedImageUrl || isEnhancing || !!form.formState.errors.imageUrl}>
                            <Sparkles className="mr-2 h-4 w-4" /> {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                        </Button>
                    </div>
                </div>
                <Button type="submit" size="lg" className="w-full md:w-auto">Submit Listing</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
