import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailDetailsModal } from './cocktail-details-modal';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cocktail } from '../../../../core/types';

describe('CocktailDetailsModal', () => {
  let component: CocktailDetailsModal;
  let fixture: ComponentFixture<CocktailDetailsModal>;
  const mockData: Partial<Cocktail> = {
    idDrink: '12345',
    strDrink: 'Mojito',
    strDrinkThumb: 'https://example.com/mojito.jpg',
    strInstructions: 'Mix ingredients and serve over ice.',
    strIngredient1: 'White Rum',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailDetailsModal],
      providers: [{ provide: MAT_DIALOG_DATA, useValue:{ cocktail: mockData }}],

    })
    .compileComponents();

    fixture = TestBed.createComponent(CocktailDetailsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
