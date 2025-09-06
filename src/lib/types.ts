export type Product = {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Books' | 'Home Goods' | 'Other';
  price: number;
  imageUrl: string;
  createdAt: Date;
  dataAiHint?: string;
};
