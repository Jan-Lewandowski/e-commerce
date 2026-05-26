"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import type { Product } from "@/types/product";

export type CartItem = { product: Product; quantity: number };

export function useCart(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: () => apiFetch<CartItem[]>("/api/cart"),
    enabled,
    staleTime: 10 * 1000,
  });
}

export function useSetCartQuantity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      apiFetch<CartItem[]>(`/api/cart/${encodeURIComponent(productId)}`, {
        method: "PUT",
        body: { quantity },
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart, data);
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) =>
      apiFetch<CartItem[]>(`/api/cart/${encodeURIComponent(productId)}`, {
        method: "DELETE",
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart, data);
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch<CartItem[]>("/api/cart", { method: "DELETE" }),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.cart, []);
    },
  });
}
