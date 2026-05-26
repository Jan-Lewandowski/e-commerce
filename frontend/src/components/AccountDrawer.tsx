import Link from "next/link"
import Button from "./ui/Button/Button"
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { X } from "lucide-react";

export default function AccountDrawer() {
  const { isAccountMenuOpen, toggleAccountMenu } = useApp()
  const { logout } = useAuth()

  if (!isAccountMenuOpen) return null;

  return <>
    <div className="pointer-events-auto absolute right-0 top-full z-50 mt-2 w-80 max-w-[90vw] max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl sm:w-96">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <h2 className="text-lg font-bold">Konto</h2>
        <Button variant="ghost" onClick={toggleAccountMenu} className="h-9 min-h-9 w-9 p-0 text-slate-500">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        <Link
          href="/account"
          onClick={toggleAccountMenu}
          className="block rounded-xl px-3 py-2 text-base font-semibold text-slate-900 no-underline transition-colors hover:bg-slate-50"
        >
          Moje konto
        </Link>
        <div className="my-4 h-px w-full bg-slate-100" />
        <Button className="w-full" onClick={logout}>Wyloguj się</Button>
      </div>
    </div>
  </>
}