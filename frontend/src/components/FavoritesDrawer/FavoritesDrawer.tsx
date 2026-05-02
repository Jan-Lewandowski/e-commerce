'use client'

import { useApp } from "@/context/AppContext";
import "@/components/FavoritesDrawer/favorites-drawer.scss";
import Button from "../ui/Button/Button";
import { X, Trash2 } from "lucide-react";

export default function FavoritesDrawer() {
  const { favorites, removeFromFavorites, clearFavorites, isFavoritesOpen, toggleFavorites } = useApp()

  if (!isFavoritesOpen) return null;

  return (
    <div className="favorites-drawer">
      <div className="favorites-header">
        <h2>Twoje ulubione</h2>
        <Button onClick={clearFavorites}><Trash2 /></Button>
        <Button onClick={toggleFavorites} variant="destructive"><X /></Button>
      </div>

      <div className="favorites-content">
        {favorites.length === 0 ? (
          <p>Nie masz ulubionych produktów</p>
        ) : (
          <ul>
            {favorites.map((item, index) => (
              <li key={index}>
                <span>{item.name}</span>
                <Button onClick={() => removeFromFavorites(index)}><Trash2 /></Button>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}