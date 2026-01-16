export type Product = {
  id: string;
  category: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  rating: number;
  thumbnail: string;
  tags: string[];
  specs: Partial<Record<string, string | number | boolean>>;
  description: string;
};
