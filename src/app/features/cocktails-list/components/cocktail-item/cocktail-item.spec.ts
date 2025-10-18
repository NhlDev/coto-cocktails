import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';

import { CocktailItem } from './cocktail-item';
import { Cocktail } from '../../../../core/types';

describe('CocktailItem', () => {
  let component: CocktailItem;
  let fixture: ComponentFixture<CocktailItem>;
  let componentRef: ComponentRef<CocktailItem>;

  const mockCocktail = {
    idDrink: '11007',
    strDrink: 'Margarita',
    strIngredient1: 'Tequila',
    strMeasure1: '1 1/2 oz ',
    strIngredient2: 'Triple sec',
    strMeasure2: '1/2 oz ',
    strIngredient3: 'Lime juice',
    strMeasure3: '1 oz ',
    strInstructions: 'Shake well with ice and strain into a cocktail glass.',
    strDrinkThumb: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg'
  } as Cocktail

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailItem]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CocktailItem);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept cocktail input', () => {
    componentRef.setInput('cocktail', mockCocktail);
    fixture.detectChanges();
    expect(componentRef.instance.cocktail()).toEqual(mockCocktail);
  });

  it('should compute ingredients and measures', () => {
    componentRef.setInput('cocktail', mockCocktail);
    fixture.detectChanges();
    const ingredientsAndMeasures = component.ingredientsAndMeasures();
    expect(ingredientsAndMeasures).toEqual([
      '1 1/2 oz  Tequila',
      '1/2 oz  Triple sec',
      '1 oz  Lime juice'
    ]);
  });

  it('should return empty array if no cocktail is provided', () => {
    componentRef.setInput('cocktail', null);
    fixture.detectChanges();
    const ingredientsAndMeasures = component.ingredientsAndMeasures();
    expect(ingredientsAndMeasures).toEqual([]);
  });
});
