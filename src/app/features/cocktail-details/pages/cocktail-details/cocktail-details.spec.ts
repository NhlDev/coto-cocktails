import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CocktailDetails } from './cocktail-details';
import { Cocktails } from '../../../../core/services';
import { Cocktail } from '../../../../core/types';
import { FAVORITE_STORAGE } from '../../../../core/tokens';

describe('CocktailDetails', () => {
  let fixture: ComponentFixture<CocktailDetails>;
  let component: CocktailDetails;
  let cocktailsSpy: jasmine.SpyObj<Cocktails>;

  const mockCocktail = {
    idDrink: '11007',
    strDrink: 'Margarita',
    strDrinkThumb: 'https://example.com/margarita.jpg',
    strInstructions: 'Shake and strain.',
    strIngredient1: 'Tequila',
    strMeasure1: '1 1/2 oz',
    strIngredient2: 'Triple sec',
    strMeasure2: '1/2 oz',
    strIngredient3: 'Lime juice',
    strMeasure3: '1 oz',
  } as unknown as Cocktail;

  beforeEach(async () => {
    cocktailsSpy = jasmine.createSpyObj<Cocktails>('Cocktails', ['searchByID']);

    await TestBed.configureTestingModule({
      imports: [CocktailDetails],
      providers: [
        { provide: Cocktails, useValue: cocktailsSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '11007' }) } } },
        { provide: FAVORITE_STORAGE, useValue: sessionStorage },
      ]
    }).compileComponents();
  });

  afterEach(() => {
    cocktailsSpy.searchByID.calls.reset();
  });

  it('should create the component', () => {
    cocktailsSpy.searchByID.and.returnValue(of([mockCocktail]));
    fixture = TestBed.createComponent(CocktailDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should fetch cocktail by route id and build ingredients list', () => {
    cocktailsSpy.searchByID.and.returnValue(of([mockCocktail]));
    fixture = TestBed.createComponent(CocktailDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(cocktailsSpy.searchByID).toHaveBeenCalledOnceWith(11007);
    expect(component.cocktail).toEqual(mockCocktail);
    expect(component.ingredientsAndMeasures).toContain('Tequila (1 1/2 oz)');
    expect(component.ingredientsAndMeasures).toContain('Triple sec (1/2 oz)');
    expect(component.ingredientsAndMeasures).toContain('Lime juice (1 oz)');
  });

  it('should keep empty state when service returns no results', () => {
    cocktailsSpy.searchByID.and.returnValue(of([]));
    fixture = TestBed.createComponent(CocktailDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(cocktailsSpy.searchByID).toHaveBeenCalled();
    expect(component.cocktail).toBeNull();
    expect(component.ingredientsAndMeasures).toEqual([]);
  });

  it('should not call the service when id param is not numeric', async () => {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: { snapshot: { paramMap: convertToParamMap({ id: 'abc' }) } }
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(CocktailDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(cocktailsSpy.searchByID).not.toHaveBeenCalled();
    expect(component.cocktail).toBeNull();
    expect(component.ingredientsAndMeasures).toEqual([]);
  });

  it('should show skeleton while loading and hide it after', () => {
    const cocktailSubject = new Subject<Cocktail[]>();
    cocktailsSpy.searchByID.and.returnValue(cocktailSubject.asObservable());

    fixture = TestBed.createComponent(CocktailDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();

    let skeleton = fixture.nativeElement.querySelector('app-cocktail-details-skeleton');
    expect(skeleton).toBeTruthy();
    expect(component.loading()).toBeTrue();

    cocktailSubject.next([mockCocktail]);
    cocktailSubject.complete();
    fixture.detectChanges();

    skeleton = fixture.nativeElement.querySelector('app-cocktail-details-skeleton');
    expect(skeleton).toBeFalsy();
    expect(component.loading()).toBeFalse();
    expect(component.cocktail).toEqual(mockCocktail);
  });
});
