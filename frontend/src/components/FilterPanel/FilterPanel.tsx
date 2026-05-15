'use client'

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useApp } from "@/context/AppContext";
import Button from "../ui/Button/Button";

export default function FilterPanel({ categories }: { categories: string[] }) {
  const { toggleTitle } = useApp();

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("category", category)
    router.push(`${pathname}?${params.toString()}`)
    toggleTitle(category);
  }



  return (
    <div className="border-b border-slate-200 bg-white">
      <ul className="mx-auto flex max-w-7xl list-none gap-2 overflow-x-auto px-4 py-3 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category: string, index: number) =>
          <Button key={index} variant="outline" onClick={() => handleClick(category)} className="shrink-0 rounded-full px-4 py-2 text-xs uppercase tracking-[0.08em]">{category}</Button>
        )}
      </ul>
    </div>

  )
}
