import { inject, Injectable } from '@angular/core';

import { FAVORITE_STORAGE } from '../../tokens';
import { Cocktail } from '../../types';

const STORAGE_KEY = 'favorite_cocktails';

@Injectable({ providedIn: 'root' })
export class FavoritesCocktails {
  private readonly storage: Storage = inject(FAVORITE_STORAGE) || localStorage;

  private cachedFavorites: Cocktail[] | null = null;

  isFavorite(cocktailId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(c => c.idDrink === cocktailId);
  }

  getFavorites(): Cocktail[] {
    if (this.cachedFavorites) return this.cachedFavorites;

    const favorites = this.storage.getItem(STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  }

  addFavorite(cocktail: Cocktail): void {
    const favorites = this.cachedFavorites || this.getFavorites();
    favorites.push(cocktail);
    this.storage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    this.cachedFavorites = favorites;
  }

  removeFavorite(cocktailId: string): void {
    let favorites = this.cachedFavorites || this.getFavorites();
    favorites = favorites.filter(c => c.idDrink !== cocktailId);
    this.storage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    this.cachedFavorites = favorites;
  }
}
