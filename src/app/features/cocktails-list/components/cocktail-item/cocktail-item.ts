import { Component, computed, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { Cocktail } from '../../../../core/types';

@Component({
  selector: 'app-cocktail-item',
  imports: [
    MatIconButton,
    MatIcon,
    MatMenuModule,
  ],
  templateUrl: './cocktail-item.html',
  styleUrl: './cocktail-item.scss'
})
export class CocktailItem {
  cocktail = input<Cocktail>();

  ingredientsAndMeasures = computed(() => {
    if (!this.cocktail()) {
      return [];
    }
    const ingredients: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = this.cocktail()![`strIngredient${i}` as keyof Cocktail];
      const measure = this.cocktail()![`strMeasure${i}` as keyof Cocktail];
      if (ingredient) {
        ingredients.push(measure ? `${measure} ${ingredient}` : ingredient);
      }
    }
    return ingredients;
  });
}