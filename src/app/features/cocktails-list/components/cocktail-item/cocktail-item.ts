import { Component, computed, inject, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

import { Cocktail } from '../../../../core/types';

@Component({
  selector: 'app-cocktail-item',
  imports: [
    MatIconButton,
    MatIcon,
    MatMenuModule,
    RouterLink,
    MatChipsModule,
  ],
  templateUrl: './cocktail-item.html',
  styleUrl: './cocktail-item.scss'
})
export class CocktailItem {
  cocktail = input<Cocktail>();
  favoriteCocktail = output<Cocktail>();
  
  toggleFavorite() {
    if (this.cocktail()) {
      this.favoriteCocktail.emit({
        ...this.cocktail()!,
        isFavorite: !this.cocktail()?.isFavorite
      });
    }
  }
}