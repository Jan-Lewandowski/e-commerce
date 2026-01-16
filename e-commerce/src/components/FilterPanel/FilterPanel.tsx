'use client'

import "@/components/FilterPanel/filter-panel.scss"
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
    <div className="filter-panel">
      <ul>
        {categories.map((category: string, index: number) =>
          <Button key={index} onClick={() => handleClick(category)} className="category-button">{category}</Button>
        )}
      </ul>
    </div>

  )
}