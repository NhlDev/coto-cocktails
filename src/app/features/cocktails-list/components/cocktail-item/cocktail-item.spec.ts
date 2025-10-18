import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

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
  } as Cocktail;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CocktailItem,
        RouterTestingModule,
      ]
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

  it('should render cocktail name and image', () => {
    componentRef.setInput('cocktail', mockCocktail);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const nameElement = compiled.querySelector('.cocktail-info h1');
    const imageElement = compiled.querySelector('.cocktail-image') as HTMLImageElement;
    expect(nameElement?.textContent).toContain('Margarita');
    expect(imageElement.src).toBe(mockCocktail.strDrinkThumb);
  });

  it('should have menu button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const menuButton = compiled.querySelector('.cocktail-menu');
    expect(menuButton).toBeTruthy();
  });

  it('should show menu on button click', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const menuButton = compiled.querySelector('.cocktail-menu') as HTMLElement;
    menuButton.click();
    fixture.detectChanges();
    const menu = compiled.querySelector('mat-menu');
    expect(menu).toBeTruthy();
  });
});
