import { TestBed } from '@angular/core/testing';

import { FavoritesCocktails } from './favorites-cocktails';
import { FAVORITE_STORAGE } from '../../tokens';

describe('FavoritesCocktails', () => {
  let service: FavoritesCocktails;
  const testCocktail = { idDrink: '12345', strDrink: 'Test Cocktail', isFavorite: true } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: FAVORITE_STORAGE, useValue: sessionStorage }]
    });
    service = TestBed.inject(FavoritesCocktails);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add and remove favorites correctly', () => {

    service.addFavorite(testCocktail);
    expect(service.isFavorite(testCocktail.idDrink)).toBeTrue();
    expect(service.getFavorites()).toContain(testCocktail);

    service.removeFavorite(testCocktail.idDrink);
    expect(service.isFavorite(testCocktail.idDrink)).toBeFalse();
    expect(service.getFavorites()).not.toContain(testCocktail);
  });

  it('should persist favorites in storage', () => {
    service.addFavorite(testCocktail);
    const storedFavorites = JSON.parse(sessionStorage.getItem('favorite_cocktails') || '[]');
    expect(storedFavorites).toContain(jasmine.objectContaining({ idDrink: '12345' }));
  });

  it('should retrieve favorites from storage', () => {
    service.addFavorite(testCocktail);
    const favorites = service.getFavorites();
    expect(favorites).toContain(testCocktail);
  });
  
  it('should return false for non-favorite cocktail', () => {
    expect(service.isFavorite('nonexistent_id')).toBeFalse();
  });

  it('should handle empty storage gracefully', () => {
    const favorites = service.getFavorites();
    expect(favorites).toEqual([]);
  });

  it('should check if a cocktail is in favorites', () => {
    service.addFavorite(testCocktail);
    expect(service.isFavorite(testCocktail.idDrink)).toBeTrue();
    service.removeFavorite(testCocktail.idDrink);
    expect(service.isFavorite(testCocktail.idDrink)).toBeFalse();
  });
});
