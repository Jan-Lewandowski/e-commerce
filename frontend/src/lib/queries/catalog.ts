"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import type { Product } from "@/types/product";

export type ProductFilters = {
  category?: string | null;
  producer?: string | null;
  priceFrom?: number | null;
  priceTo?: number | null;
  ratingFrom?: number | null;
  ratingTo?: number | null;
  q?: string | null;
};

function buildQuery(filters: ProductFilters = {}) {
  return {
    category: filters.category || undefined,
    producer: filters.producer || undefined,
    priceFrom: filters.priceFrom ?? undefined,
    priceTo: filters.priceTo ?? undefined,
    ratingFrom: filters.ratingFrom ?? undefined,
    ratingTo: filters.ratingTo ?? undefined,
    q: filters.q || undefined,
  };
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => apiFetch<string[]>("/api/categories"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => apiFetch<Product[]>("/api/products", { query: buildQuery(filters) }),
    staleTime: 30 * 1000,
  });
}

export function useProduct(id: string | undefined | null) {
  return useQuery({
    queryKey: queryKeys.product(id ?? ""),
    queryFn: () => apiFetch<Product>(`/api/products/${id}`),
    enabled: Boolean(id),
  });
}

export function useRelatedProducts(id: string | undefined | null, limit = 5) {
  return useQuery({
    queryKey: queryKeys.relatedProducts(id ?? "", limit),
    queryFn: () =>
      apiFetch<Product[]>(`/api/products/${id}/related`, { query: { limit } }),
    enabled: Boolean(id),
  });
}

export type UpdateProductInput = {
  id: string;
  formData: FormData;
};

export type CreateProductInput = {
  formData: FormData;
};

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: UpdateProductInput) =>
      apiFetch<Product>(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      }),
    onSuccess: (product) => {
      queryClient.setQueryData(queryKeys.product(product.id), product);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData }: CreateProductInput) =>
      apiFetch<Product>("/api/products", {
        method: "POST",
        body: formData,
      }),
    onSuccess: (product) => {
      queryClient.setQueryData(queryKeys.product(product.id), product);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
