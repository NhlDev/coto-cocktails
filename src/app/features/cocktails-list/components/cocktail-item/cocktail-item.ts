import { Component, computed, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { Cocktail } from '../../../../core/types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cocktail-item',
  imports: [
    MatIconButton,
    MatIcon,
    MatMenuModule,
    RouterLink,
  ],
  templateUrl: './cocktail-item.html',
  styleUrl: './cocktail-item.scss'
})
export class CocktailItem {
  cocktail = input<Cocktail>();
}