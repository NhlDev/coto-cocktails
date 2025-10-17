import { Component, effect, inject, signal } from '@angular/core';
import { SearchBar } from "../../components/search-bar/search-bar";
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
  showFiltersPanel = signal(true);

  constructor() {
    const isHandset = this.breakpointObserver.isMatched(Breakpoints.Handset);
    if (isHandset) {
      this.showFiltersPanel.set(false); // para mantener los filtros cerrados en dispositivos móviles
    }
  }

  toggleFiltersPanel() {
    this.showFiltersPanel.update(value => !value);    
  }
}
