export const queryKeys = {
  me: ["me"] as const,
  categories: ["categories"] as const,
  products: (filters?: Record<string, unknown>) =>
    ["products", filters ?? {}] as const,
  product: (id: string) => ["product", id] as const,
  relatedProducts: (id: string, limit?: number) =>
    ["product", id, "related", limit ?? 5] as const,
  suppliers: ["suppliers"] as const,
  supplier: (id: string) => ["supplier", id] as const,
  supplierProducts: (id: string) => ["supplier", id, "products"] as const,
  cart: ["cart"] as const,
  favorites: ["favorites"] as const,
  myOrders: ["orders", "me"] as const,
  adminOrders: ["orders", "admin"] as const,
  order: (id: string) => ["order", id] as const,
};
