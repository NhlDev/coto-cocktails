import { Component, inject, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';

import { FilterModel } from '../../types';
import { Cocktails } from '../../../../core/services';
import { Cocktail } from '../../../../core/types';
import { SearchBar } from '../../components/search-bar/search-bar';

@Component({
  selector: 'app-cocktails-list',
  imports: [
    MatIconButton,
    MatIconModule,
    MatListModule,
    SearchBar,
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

    switch (filter.filterBy) {
      case 'name':
        this.cocktailService.searchByName(filter.searchInput).subscribe(cocktails => this.cocktailsList.set(cocktails));
        break;
      case 'ingredient':
        this.cocktailService.searchByIngredient(filter.searchInput).subscribe(cocktails => this.cocktailsList.set(cocktails));
        break;
      case 'id':
        this.cocktailService.searchByID(+filter.searchInput).subscribe(cocktails => this.cocktailsList.set(cocktails));
        break;
      default:
        console.warn('Unknown filter type:', filter.filterBy);
        break;
    }

  }
}
