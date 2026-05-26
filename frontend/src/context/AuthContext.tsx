"use client";

import { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import { queryKeys } from "@/lib/queryKeys";

type AuthContextType = {
  user: User | null | undefined;
  isLoggedIn: boolean;
  isUserLoading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading: isUserLoading } = useQuery<User | null>({
    queryKey: queryKeys.me,
    queryFn: async () => {
      try {
        return await apiFetch<User>("/api/auth/me");
      } catch (err) {
        if (err instanceof Error && err.message.includes("HTTP 401")) return null;
        throw err;
      }
    },
    retry: false,
  });

  const isLoggedIn = !!user;

  const { mutate: logout } = useMutation({
    mutationFn: () => apiFetch<void>("/api/auth/logout", { method: "POST" }),
    onSuccess: async () => {
      queryClient.setQueryData(queryKeys.me, null);
      queryClient.removeQueries({ queryKey: queryKeys.cart });
      queryClient.removeQueries({ queryKey: queryKeys.favorites });
      queryClient.removeQueries({ queryKey: queryKeys.myOrders });
      queryClient.removeQueries({ queryKey: queryKeys.adminOrders });
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
      router.replace("/signup");
    },
  });

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isUserLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("context error");
  return context;
};
