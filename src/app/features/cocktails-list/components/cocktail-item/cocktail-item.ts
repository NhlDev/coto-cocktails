import { Component, computed, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {  MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Cocktail } from '../../../../core/types';
import { CocktailDetailsModal } from '../cocktail-details-modal/cocktail-details-modal';

@Component({
  selector: 'app-cocktail-item',
  imports: [
    MatIconButton,
    MatIcon,
    MatMenuModule,
    MatDialogModule,
  ],
  templateUrl: './cocktail-item.html',
  styleUrl: './cocktail-item.scss'
})
export class CocktailItem {
  cocktail = input<Cocktail>();
  dialog = inject(MatDialog);

  openDetails() {
    this.dialog.open(CocktailDetailsModal, {
      data: {
        cocktail: this.cocktail(),
      }
    });
  }
}