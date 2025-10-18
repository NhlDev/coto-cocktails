import { Component, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from "@angular/material/input";
import { finalize } from 'rxjs';

import { FilterModel } from '../../types';
import { Cocktails } from '../../../../core/services';
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
    SearchBar,
    CocktailItem,
    CocktailItemSkeleton,
],
  templateUrl: './cocktails-list.html',
  styleUrl: './cocktails-list.scss'
})
export class CocktailsList {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly isHandset = this.breakpointObserver.isMatched(Breakpoints.Handset);

  private readonly cocktailService = inject(Cocktails);

  showFiltersPanel = signal(true);
  cocktailsList = signal<Cocktail[] | null>(null);
  loading = signal(false);

  constructor() {
    if (this.isHandset) {
      this.showFiltersPanel.set(false); // para mantener los filtros cerrados en dispositivos móviles
    }
  }

  toggleFiltersPanel() {
    this.showFiltersPanel.update(value => !value);
  }

  filterCocktails(filter: FilterModel) {
    console.log('Filtering cocktails with:', filter);
    // Lógica para filtrar la lista de cócteles según el filtro recibido
    let cocktailsObservable;
    this.loading.set(true);
    this.cocktailsList.set(null);

    switch (filter.filterBy) {
      case 'name':
        cocktailsObservable = this.cocktailService.searchByName(filter.searchInput);
        break;
      case 'ingredient':
        cocktailsObservable = this.cocktailService.searchByIngredient(filter.searchInput);
        break;
      case 'id':
        cocktailsObservable = this.cocktailService.searchByID(+filter.searchInput);
        break;
      default:
        console.warn('Unknown filter type:', filter.filterBy);
        break;
    }

    cocktailsObservable
      ?.pipe(finalize(() => this.loading.set(false)))
      .subscribe(cocktails => this.cocktailsList.set(cocktails));

  }
}
