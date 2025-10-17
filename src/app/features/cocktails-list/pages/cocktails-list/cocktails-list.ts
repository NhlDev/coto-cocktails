import { Component, effect, inject, signal } from '@angular/core';
import { SearchBar } from "../../components/search-bar/search-bar";
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FilterModel } from '../../types';

@Component({
  selector: 'app-cocktails-list',
  imports: [
    MatIconButton,
    MatIconModule,
    SearchBar,
  ],
  templateUrl: './cocktails-list.html',
  styleUrl: './cocktails-list.scss'
})
export class CocktailsList {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly isHandset = this.breakpointObserver.isMatched(Breakpoints.Handset);

  showFiltersPanel = signal(true);

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

  }
}
