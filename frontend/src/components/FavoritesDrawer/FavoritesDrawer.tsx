'use client'

import { useApp } from "@/context/AppContext";
import Button from "../ui/Button/Button";
import { X, Trash2 } from "lucide-react";

export default function FavoritesDrawer() {
  const { favorites, removeFromFavorites, clearFavorites, isFavoritesOpen, toggleFavorites } = useApp()

  if (!isFavoritesOpen) return null;

  return (
    <div className="pointer-events-auto absolute right-0 top-full z-50 mt-2 w-80 max-w-[90vw] max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl sm:w-96">
      <div className="flex items-center justify-between border-b border-slate-200 p-4">
        <h2 className="text-lg font-bold">Twoje ulubione</h2>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={clearFavorites} className="h-10 min-h-9 w-9 p-0 text-slate-500">
            <Trash2 className="h-10 w-10" />
          </Button>
          <Button variant="ghost" onClick={toggleFavorites} className="h-9 min-h-9 w-9 p-0 text-slate-500">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        {favorites.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">Nie masz ulubionych produktów</p>
        ) : (
          <ul className="m-0 list-none divide-y divide-slate-100 p-0">
            {favorites.map((item, index) => (
              <li key={index} className="flex items-center justify-between gap-3 py-3">
                <span className="min-w-0 truncate text-sm font-semibold">{item.name}</span>
                <Button variant="ghost" onClick={() => removeFromFavorites(index)} className="h-9 min-h-9 w-9 p-0 text-red-500">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
