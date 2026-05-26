'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import CartPopUpHost from '@/components/CartPopUpHost';

export const queryClient = new QueryClient();

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          {children}
          <CartPopUpHost />
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}