'use client';

import { useApp } from "@/context/AppContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, authReady } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!authReady) return;
    if (!isLoggedIn) router.replace("/signup");
  }, [authReady, isLoggedIn, pathname]);

  return <>{children}</>;
}
