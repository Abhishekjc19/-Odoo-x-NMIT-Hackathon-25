import type { Product } from './types';

const products: Product[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Vintage Leather Jacket',
    description: 'A stylish vintage leather jacket in excellent condition. Barely worn. Classic look.',
    category: 'Clothing',
    price: 120,
    imageUrl: 'https://picsum.photos/seed/jacket/600/400',
    createdAt: new Date('2023-10-01'),
    dataAiHint: 'leather jacket',
  },
  {
    id: '2',
    userId: 'user2',
    title: 'Mid-Century Modern Armchair',
    description: 'Beautifully restored mid-century modern armchair. A statement piece for any living room.',
    category: 'Furniture',
    price: 450,
    imageUrl: 'https://picsum.photos/seed/armchair/600/400',
    createdAt: new Date('2023-10-05'),
    dataAiHint: 'modern armchair',
  },
  {
    id: '3',
    userId: 'user1',
    title: 'Wireless Noise-Cancelling Headphones',
    description: 'High-quality wireless headphones with active noise cancellation. Long battery life.',
    category: 'Electronics',
    price: 85,
    imageUrl: 'https://picsum.photos/seed/headphones/600/400',
    createdAt: new Date('2023-10-10'),
    dataAiHint: 'wireless headphones',
  },
  {
    id: '4',
    userId: 'user3',
    title: 'The Great Gatsby - Hardcover',
    description: 'A classic novel by F. Scott Fitzgerald. This is a beautiful hardcover edition.',
    category: 'Books',
    price: 15,
    imageUrl: 'https://picsum.photos/seed/book/600/400',
    createdAt: new Date('2023-10-12'),
    dataAiHint: 'hardcover book',
  },
  {
    id: '5',
    userId: 'user2',
    title: 'Ceramic Dinnerware Set',
    description: 'A complete set of ceramic dinnerware for four. Includes plates, bowls, and mugs.',
    category: 'Home Goods',
    price: 75,
    imageUrl: 'https://picsum.photos/seed/dinnerware/600/400',
    createdAt: new Date('2023-10-15'),
    dataAiHint: 'ceramic dinnerware',
  },
  {
    id: '6',
    userId: 'user3',
    title: 'Acoustic Guitar',
    description: 'A well-maintained acoustic guitar, perfect for beginners or intermediate players.',
    category: 'Other',
    price: 150,
    imageUrl: 'https://picsum.photos/seed/guitar/600/400',
    createdAt: new Date('2023-10-18'),
    dataAiHint: 'acoustic guitar',
  },
  {
    id: '7',
    userId: 'user1',
    title: 'Classic Denim Jeans',
    description: 'Comfortable and durable denim jeans. Straight fit, size 32/32.',
    category: 'Clothing',
    price: 40,
    imageUrl: 'https://picsum.photos/seed/jeans/600/400',
    createdAt: new Date('2023-10-20'),
    dataAiHint: 'denim jeans',
  },
  {
    id: '8',
    userId: 'user2',
    title: 'Antique Wooden Desk',
    description: 'Solid oak desk with intricate carvings. Adds a touch of elegance to any home office.',
    category: 'Furniture',
    price: 300,
    imageUrl: 'https://picsum.photos/seed/desk/600/400',
    createdAt: new Date('2023-10-22'),
    dataAiHint: 'wooden desk',
  },
];

export function getProducts({ search, category }: { search?: string; category?: Product['category'] | 'All' }): Product[] {
  let filteredProducts = products;

  if (search) {
    filteredProducts = filteredProducts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  }

  if (category && category !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  return filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export const getCategories = (): Array<Product['category']> => ['Electronics', 'Furniture', 'Clothing', 'Books', 'Home Goods', 'Other'];

export function addProduct(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
        ...product,
        id: (products.length + 1).toString(),
        createdAt: new Date(),
    };
    products.unshift(newProduct);
    return newProduct;
}

export function getProductsByUserId(userId: string): Product[] {
    return products.filter(p => p.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function deleteProduct(productId: string, userId: string): boolean {
    const index = products.findIndex(p => p.id === productId && p.userId === userId);
    if (index !== -1) {
        products.splice(index, 1);
        return true;
    }
    return false;
}
