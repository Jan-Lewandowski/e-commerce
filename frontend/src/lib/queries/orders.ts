"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import type { CompletedOrder } from "@/types/completedOrder";
import type { OrderDetails } from "@/types/orderDetails";

export type CreateOrderPayload = {
  items: { productId: string; quantity: number }[];
  destination: NonNullable<OrderDetails["destination"]>;
  paymentMethod: string;
  deliveryMethod: string;
  shipper?: string;
  email?: string;
};

export function useMyOrders(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.myOrders,
    queryFn: () => apiFetch<CompletedOrder[]>("/api/orders/me"),
    enabled,
  });
}

export function useAdminOrders(enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.adminOrders,
    queryFn: () => apiFetch<CompletedOrder[]>("/api/admin/orders"),
    enabled,
  });
}

export function useOrder(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.order(id ?? ""),
    queryFn: () => apiFetch<CompletedOrder>(`/api/orders/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      apiFetch<CompletedOrder>("/api/orders", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myOrders });
      queryClient.invalidateQueries({ queryKey: queryKeys.adminOrders });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
}
