"use client";

import { createContext, useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";

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

  const fetchMe = async () => {
    const response = await fetch("http://localhost:3001/api/auth/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Błąd podczas sprawdzania autoryzacji");
    }

    return response.json();
  };

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
  });

  const isLoggedIn = !!user;

  const logoutRequest = async () => {
    const response = await fetch("http://localhost:3001/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Błąd podczas wylogowywania");
    }
  };

  const { mutate: logout } = useMutation({
    mutationFn: logoutRequest,
    onSuccess: async () => {
      queryClient.setQueryData(["me"], null);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      router.replace("/signup");
    }
  });

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isUserLoading, logout }}>
      {children}
    </AuthContext.Provider >
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("context error");
  return context;
};