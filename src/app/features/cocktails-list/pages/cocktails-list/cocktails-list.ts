import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from "@angular/material/input";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { finalize, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { FilterModel } from '../../types';
import { Cocktails, FavoritesCocktails } from '../../../../core/services';
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
  ],
  templateUrl: './cocktails-list.html',
  styleUrl: './cocktails-list.scss'
})
export class CocktailsList implements OnInit {
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

  showFiltersPanel = signal(true);

  cocktailsList = signal<Cocktail[] | null>(null);
  favoritesList = signal<Cocktail[] | null>(null);

  cocktailListToShow = computed(() => {
    if (this.showFavoritesOnly()) {
      return this.favoritesList();
    }
    return this.cocktailsList();
  });

  loading = signal(false);

  showFavoritesOnly = signal(false);

  readonly estimatedSize = 175;
  readonly trackBy = (idx: number, c: Cocktail) => c.idDrink;

  constructor() {
    if (this.isHandset()) {
      this.showFiltersPanel.set(false); // mantener los filtros cerrados en móviles
    }
  }

  ngOnInit(): void {
    this.favoritesList.set(this.favoritesService.getFavorites());
  }

  toggleFiltersPanel() {
    this.showFiltersPanel.update(value => !value);
  }

  filterCocktails(filter: FilterModel) {
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
  }

  toggleFavorite(cocktail: Cocktail) {
    if (cocktail.isFavorite) {
      this.favoritesService.addFavorite(cocktail);
    } else {
      this.favoritesService.removeFavorite(cocktail.idDrink);
    }
    this.cocktailsList.update(cocktails => {
      return cocktails?.map(c => {
        if (c.idDrink === cocktail.idDrink) {
          return { ...c, isFavorite: !c.isFavorite };
        }
        return c;
      }) || null;
    });

    this.favoritesList.set(this.favoritesService.getFavorites());
  }

  showFavoriteCocktails() {
    // si voy a mostrar solo favoritos y el panel de filtros está abierto, lo cierro
    if (!this.showFavoritesOnly() && this.showFiltersPanel()) {
      this.toggleFiltersPanel();
    }

    this.showFavoritesOnly.update(value => !value);
  }
}
