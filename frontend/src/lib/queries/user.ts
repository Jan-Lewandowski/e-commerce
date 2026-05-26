"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";
import type { User } from "@/types/user";

export type UpdateMyProfilePayload = {
  name?: string | null;
  phone?: string | null;
  street?: string | null;
  city?: string | null;
  zipCode?: string | null;
};

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMyProfilePayload) =>
      apiFetch<User>("/api/users/me/profile", {
        method: "PATCH",
        body: payload,
      }),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.me, user);
    },
  });
}
