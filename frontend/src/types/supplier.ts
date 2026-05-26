import type { Product } from "@/types/product";

export type SupplierProductLink = {
  id: number;
  productId: string;
  supplierId: number;
  leadDays: number;
  createdAt?: string;
  updatedAt?: string;
};

export type SupplierSummary = {
  id: number;
  name: string;
  email: string;
  rating?: number;
  phone?: string | null;
  contactName?: string | null;
  address?: string | null;
};

export type Supplier = SupplierSummary & {
  productLinks?: SupplierProductLink[];
  createdAt?: string;
  updatedAt?: string;
};

export type SupplierWithProducts = {
  supplier: Supplier;
  products: Product[];
};
