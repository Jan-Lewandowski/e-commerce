"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import type { Product } from "@/types/product";

export function useFavorites(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.favorites,
    queryFn: () => apiFetch<Product[]>("/api/favorites"),
    enabled,
    staleTime: 10 * 1000,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) =>
      apiFetch<Product[]>(`/api/favorites/${encodeURIComponent(productId)}`, {
        method: "POST",
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.favorites, data);
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) =>
      apiFetch<Product[]>(`/api/favorites/${encodeURIComponent(productId)}`, {
        method: "DELETE",
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.favorites, data);
    },
  });
}

export function useClearFavorites() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiFetch<Product[]>("/api/favorites", { method: "DELETE" }),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.favorites, []);
    },
  });
}
