import { Component, inject, signal, computed, effect, } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from "@angular/material/input";
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, map } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { FilterModel } from '../../types';
import { Cocktails, FavoritesCocktails, SyncTabs } from '../../../../core/services';
import { Cocktail } from '../../../../core/types';
import { SearchBar } from '../../components/search-bar/search-bar';
import { CocktailItem } from '../../components/cocktail-item/cocktail-item';
import { CocktailItemSkeleton } from '../../components/cocktail-item-skeleton/cocktail-item-skeleton';

@Component({
  selector: 'app-cocktails-list',
  imports: [
    MatIconButton,
    MatIconModule,
    MatListModule,
    MatInputModule,
    ScrollingModule,
    SearchBar,
    CocktailItem,
    CocktailItemSkeleton,
    MatSnackBarModule,
  ],
  templateUrl: './cocktails-list.html',
  styleUrl: './cocktails-list.scss'
})
export class CocktailsList {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly isHandset = toSignal(
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map(r => r.matches)
      ),
    { initialValue: this.breakpointObserver.isMatched(Breakpoints.Handset) }
  );
  private readonly cocktailService = inject(Cocktails);
  private readonly favoritesService = inject(FavoritesCocktails);
  private readonly broadcastService = inject(SyncTabs);
  private snack = inject(MatSnackBar);

  initialFilters = this.broadcastService.filtersSignal;
  showFiltersPanel = signal(true);
  cocktailsList = signal<Cocktail[] | null>(null);

  // Convierte el Observable de favoritos en una señal reactiva
  favoritesList = toSignal(this.favoritesService.favorites$, { initialValue: [] as Cocktail[] });

  cocktailListToShow = computed(() => {
    if (this.showFavoritesOnly()) {
      return this.favoritesList();
    }
    return this.cocktailsList();
  });

  loading = signal(false);
  showFavoritesOnly = signal(false);
  lastAppliedFilter = signal<FilterModel | null>(null);

  readonly estimatedSize = 175;
  readonly trackBy = (idx: number, c: Cocktail) => c.idDrink;

  constructor() {
    if (this.isHandset()) {
      this.showFiltersPanel.set(false);
    }

    // Efecto para reaccionar a los cambios de la señal de cócteles del servicio
    effect(() => {
      const syncedCocktails = this.broadcastService.cocktailsSignal();
      if (syncedCocktails.length > 0) {
        // Marcar favoritos en la lista que llega de otra pestaña
        const cocktailsWithFavorites = syncedCocktails.map(c => ({
          ...c,
          isFavorite: this.favoritesService.isFavorite(c.idDrink)
        }));
        this.cocktailsList.set(cocktailsWithFavorites);
      }
    });

    // Efecto: si cambian los favoritos (en esta u otra pestaña), reflejarlo en la lista actual
    effect(() => {
      const favorites = this.favoritesList(); // signal derivada de favorites$
      const favIds = new Set(favorites.map((f: Cocktail) => f.idDrink));
      this.cocktailsList.update(list => {
        if (!list) return list;
        return list.map(c => ({ ...c, isFavorite: favIds.has(c.idDrink) }));
      });
    });
  }

  toggleFiltersPanel() {
    this.showFiltersPanel.update(value => !value);
  }

  filterCocktails(filter: FilterModel) {
    this.lastAppliedFilter.set(filter);
    let cocktailsObservable$;
    this.loading.set(true);
    this.cocktailsList.set(null);

    switch (filter.filterBy) {
      case 'name':
        cocktailsObservable$ = this.cocktailService.searchByName(filter.searchInput);
        break;
      case 'ingredient':
        cocktailsObservable$ = this.cocktailService.searchByIngredient(filter.searchInput);
        break;
      case 'id':
        cocktailsObservable$ = this.cocktailService.searchByID(+filter.searchInput);
        break;
      default:
        console.warn('Unknown filter type:', filter.filterBy);
        break;
    }

    cocktailsObservable$
      ?.pipe(
        finalize(() => this.loading.set(false)),
        map(cocktails => {
          cocktails.forEach(cocktail => cocktail.isFavorite = this.favoritesService.isFavorite(cocktail.idDrink));
          return cocktails;
        })
      ).subscribe(cocktails => this.cocktailsList.set(cocktails));

    if (this.isHandset()) {
      this.toggleFiltersPanel();
    }

    this.broadcastService.syncFilters(filter);
  }

  clearSearch() {
    this.lastAppliedFilter.set(null);
    this.cocktailsList.set(null);
    this.showFavoritesOnly.set(false);
    if (!this.isHandset()) this.showFiltersPanel.set(true);
  }

  toggleFavorite(cocktail: Cocktail) {
    if (cocktail.isFavorite) {
      this.favoritesService.addFavorite(cocktail);
      this.snack.open(`Agregado a favoritos: ${cocktail.strDrink}`, undefined, { duration: 1800 });
    } else {
      this.favoritesService.removeFavorite(cocktail.idDrink);
      this.snack.open(`Quitado de favoritos: ${cocktail.strDrink}`, undefined, { duration: 1800 });
    }

    // actualizo el estado del cóctel en la lista actual
    this.cocktailsList.update((list: Cocktail[] | null) => {
      if (list === null) return list;
      return list.map(c => {
        if (c.idDrink === cocktail.idDrink) {
          return { ...c, isFavorite: cocktail.isFavorite };
        }
        return c;
      });
    });
  }

  showFavoriteCocktails() {
    const showFavoriteList = !this.showFavoritesOnly();

    if (showFavoriteList) {
      this.showFiltersPanel.set(false);
    }
    else if (!this.isHandset() && (this.cocktailsList() === null || this.cocktailsList()?.length === 0)) {
      this.showFiltersPanel.set(true);
    }

    this.showFavoritesOnly.update(value => !value);
  }
}
