import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Cocktail } from '../../../../core/types';

@Component({
  selector: 'app-cocktail-details-modal',
  imports: [MatIcon, MatButtonModule, MatDialogClose],
  templateUrl: './cocktail-details-modal.html',
  styleUrl: './cocktail-details-modal.scss'
})
export class CocktailDetailsModal implements OnInit {
  cocktail = inject(MAT_DIALOG_DATA).cocktail as Cocktail;
  ingredientsAndMeasures: string[] = [];


  ngOnInit() {
    const ingredients: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = this.cocktail[`strIngredient${i}` as keyof Cocktail];
      const measure = this.cocktail[`strMeasure${i}` as keyof Cocktail];
      if (ingredient) {
        ingredients.push(measure ? `${ingredient} (${measure})` : ingredient);
      }
    }
    this.ingredientsAndMeasures = ingredients;
  }
}
