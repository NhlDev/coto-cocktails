import { effect, inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { FAVORITE_STORAGE } from '../../tokens';
import { Cocktail } from '../../types';
import { SyncTabs } from '../sync-tabs/sync-tabs';

const STORAGE_KEY = 'favorite_cocktails';

@Injectable({ providedIn: 'root' })
export class FavoritesCocktails {
  private readonly storage: Storage = inject(FAVORITE_STORAGE);
  private readonly syncService = inject(SyncTabs);

  private favoritesSubject: BehaviorSubject<Cocktail[]> = new BehaviorSubject<Cocktail[]>(this.getFavoritesFromStorage());
  public favorites$ = this.favoritesSubject.asObservable();

  private hasProcessedInitial = false;

  constructor() {
    // Publico mi estado inicial si existe
    if (this.favoritesSubject.value.length > 0) {
      this.syncService.syncFavorites(this.favoritesSubject.value);
    }

    effect(() => {
      const favoritesFromTab = this.syncService.favoritesSignal();

      // Solo en el primer tick: si llega vacío y yo tengo datos, no me piso y anuncio mi estado
      if (!this.hasProcessedInitial) {
        this.hasProcessedInitial = true;
        if (favoritesFromTab.length === 0 && this.favoritesSubject.value.length > 0) {
          this.syncService.syncFavorites(this.favoritesSubject.value);
          return;
        }
      }

      if (JSON.stringify(favoritesFromTab) !== JSON.stringify(this.favoritesSubject.value)) {
        this.updateState(favoritesFromTab, false);
      }
    });
  }

  private getFavoritesFromStorage(): Cocktail[] {
    const favorites = this.storage.getItem(STORAGE_KEY);
    const parsedFavorites = favorites ? JSON.parse(favorites) : [];
    parsedFavorites.forEach((c: Cocktail) => c.isFavorite = true);
    return parsedFavorites;
  }

  private updateState(favorites: Cocktail[], broadcast: boolean): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);

    if (broadcast) {
      this.syncService.syncFavorites(favorites);
    }
  }

  isFavorite(cocktailId: string): boolean {
    return this.favoritesSubject.value.some(c => c.idDrink === cocktailId);
  }

  getFavorites(): Cocktail[] {
    return this.favoritesSubject.value;
  }

  addFavorite(cocktail: Cocktail): void {
    const currentFavorites = this.getFavorites();
    if (!this.isFavorite(cocktail.idDrink)) {
      const updatedFavorites = [...currentFavorites, { ...cocktail, isFavorite: true }];
      this.updateState(updatedFavorites, true);
    }
  }

  removeFavorite(cocktailId: string): void {
    const currentFavorites = this.getFavorites();
    const updatedFavorites = currentFavorites.filter(c => c.idDrink !== cocktailId);
    this.updateState(updatedFavorites, true);
  }
}
