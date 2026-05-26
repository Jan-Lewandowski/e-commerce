"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import type { Product } from "@/types/product";
import type { Supplier } from "@/types/supplier";

export function useSuppliers() {
  return useQuery({
    queryKey: queryKeys.suppliers,
    queryFn: () => apiFetch<Supplier[]>("/api/suppliers"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSupplier(id: string | undefined | null) {
  return useQuery({
    queryKey: queryKeys.supplier(id ?? ""),
    queryFn: () => apiFetch<Supplier>(`/api/suppliers/${id}`),
    enabled: Boolean(id),
  });
}

export function useSupplierProducts(id: string | undefined | null) {
  return useQuery({
    queryKey: queryKeys.supplierProducts(id ?? ""),
    queryFn: () => apiFetch<Product[]>(`/api/suppliers/${id}/products`),
    enabled: Boolean(id),
  });
}
