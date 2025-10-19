import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { finalize } from 'rxjs';

import { Cocktail } from '../../../../core/types';
import { Cocktails, FavoritesCocktails } from '../../../../core/services';
import { CocktailDetailsSkeleton } from '../../components/cocktail-details-skeleton/cocktail-details-skeleton';

@Component({
  selector: 'app-cocktail-details',
  imports: [
    MatIcon,
    MatButtonModule,
    MatCardModule,
    RouterLink,
    CocktailDetailsSkeleton,
  ],
  templateUrl: './cocktail-details.html',
  styleUrl: './cocktail-details.scss'
})
export class CocktailDetails implements OnInit {
  ingredientsAndMeasures: string[] = [];
  cocktail: Cocktail | null = null;
  loading = signal(true);

  private cocktailService = inject(Cocktails);
  private favoritesService = inject(FavoritesCocktails);
  private route = inject(ActivatedRoute)

  ngOnInit() {
    const cocktailId = this.route.snapshot.paramMap.get('id');
    if (cocktailId && !isNaN(+cocktailId)) {
      this.cocktailService.searchByID(+cocktailId)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe(cocktail => {
          if (cocktail.length > 0) {
            this.cocktail = cocktail[0];
            this.extractIngredientsAndMeasures();
          }
        });
    }
  }

  toggleFavorite() {
    if (!this.cocktail) return;
    if (this.favoritesService.isFavorite(this.cocktail.idDrink)) {
      this.favoritesService.removeFavorite(this.cocktail.idDrink);
      this.cocktail.isFavorite = false;
    } else {
      this.favoritesService.addFavorite(this.cocktail);
      this.cocktail.isFavorite = true;
    }
  }

  private extractIngredientsAndMeasures() {
    if (!this.cocktail) return;

    const ingredients: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = this.cocktail[`strIngredient${i}` as keyof Cocktail];
      const measure = this.cocktail[`strMeasure${i}` as keyof Cocktail];
      if (!!ingredient) {
        ingredients.push(measure ? `${ingredient} (${measure})` : String(ingredient));
      }
    }
    this.ingredientsAndMeasures = ingredients;
  }
}
