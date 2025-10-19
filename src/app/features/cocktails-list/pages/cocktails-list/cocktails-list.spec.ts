import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, RouterLink } from '@angular/router';

import { CocktailsList } from './cocktails-list';
import { Cocktails, FavoritesCocktails, SyncTabs } from '../../../../core/services';
import { BASE_API_URL, FAVORITE_STORAGE } from '../../../../core/tokens';
import { FilterModel } from '../../types';
import { Cocktail } from '../../../../core/types';
import { BehaviorSubject } from 'rxjs';
import { signal } from '@angular/core';

class MockSyncTabs {
  favoritesSignal = signal<Cocktail[]>([]);
  cocktailsSignal = signal<Cocktail[]>([]);
  scrollStateSignal = signal<number>(0);
  filtersSignal = signal<FilterModel | null>(null);
  syncFilters = jasmine.createSpy('syncFilters');
  syncCocktails = jasmine.createSpy('syncCocktails');
  syncFavorites = jasmine.createSpy('syncFavorites');
  syncScrollState = jasmine.createSpy('syncScrollState');
}

class MockFavoritesService {
  private subject: BehaviorSubject<Cocktail[]>;
  public favorites$;

  addFavorite = jasmine.createSpy('addFavorite');
  removeFavorite = jasmine.createSpy('removeFavorite');
  isFavorite = jasmine.createSpy('isFavorite').and.callFake((id: string) => {
    return this.subject.value.some(c => c.idDrink === id);
  });

  constructor(initial: Cocktail[] = []) {
    this.subject = new BehaviorSubject<Cocktail[]>(initial);
    this.favorites$ = this.subject.asObservable();
  }

  // helper para tests
  next(value: Cocktail[]) {
    this.subject.next(value);
  }
}

describe('CocktailsList', () => {
  let component: CocktailsList;
  let fixture: ComponentFixture<CocktailsList>;
  const baseApiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/';
  let httpMock: HttpTestingController;

  // Mocks
  let mockFavoritesService: MockFavoritesService;
  let mockSyncTabs: MockSyncTabs;

  const mockCocktail1 = { idDrink: '11007', strDrink: 'Margarita', isFavorite: false } as Cocktail;
  const mockCocktail2 = { idDrink: '11008', strDrink: 'Manhattan', isFavorite: true } as Cocktail;

  beforeEach(async () => {
    mockFavoritesService = new MockFavoritesService([mockCocktail2]);
    mockSyncTabs = new MockSyncTabs();

    await TestBed.configureTestingModule({
      imports: [CocktailsList, HttpClientTestingModule, ScrollingModule, RouterLink],
      providers: [
        Cocktails,
        { provide: BASE_API_URL, useValue: baseApiUrl },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '11007' }) } } },
        { provide: FAVORITE_STORAGE, useValue: sessionStorage },
        { provide: FavoritesCocktails, useValue: mockFavoritesService },
        { provide: SyncTabs, useValue: mockSyncTabs },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CocktailsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial states', () => {
    expect(component.showFiltersPanel()).toBeTrue();
    expect(component.cocktailsList()).toBeNull();
    expect(component.loading()).toBeFalse();
  });

  it('should initialize favorites from favorites$ stream', () => {
    expect(component.favoritesList()).toEqual([mockCocktail2]);
  });

  it('should toggle filters panel', () => {
    const initialState = component.showFiltersPanel();
    component.toggleFiltersPanel();
    expect(component.showFiltersPanel()).toBe(!initialState);
  });

  it('should toggle a cocktail as favorite', () => {
    component.cocktailsList.set([{ ...mockCocktail1 }]);
    const cocktailToToggle = { ...mockCocktail1, isFavorite: true };

    component.toggleFavorite(cocktailToToggle);

    expect(mockFavoritesService.addFavorite).toHaveBeenCalledWith(cocktailToToggle);
    expect(component.cocktailsList()?.[0].isFavorite).toBeTrue();
  });

  it('should toggle a cocktail as not favorite', () => {
    component.cocktailsList.set([{ ...mockCocktail2 }]);
    const cocktailToToggle = { ...mockCocktail2, isFavorite: false };

    component.toggleFavorite(cocktailToToggle);

    expect(mockFavoritesService.removeFavorite).toHaveBeenCalledWith(mockCocktail2.idDrink);
    expect(component.cocktailsList()?.[0].isFavorite).toBeFalse();
  });

  it('should toggle showing only favorite cocktails', () => {
    const initialState = component.showFavoritesOnly();
    component.showFavoriteCocktails();
    expect(component.showFavoritesOnly()).toBe(!initialState);
    expect(component.showFiltersPanel()).toBeFalse();
  });

  it('should show message when no favorites are added yet', () => {
    component.showFavoriteCocktails(); // show favorites
    mockFavoritesService.next([]); // simular que no hay favoritos
    fixture.detectChanges();

    const noResultsElement = fixture.nativeElement.querySelector('.no-results');
    expect(noResultsElement).toBeTruthy();
    expect(noResultsElement.textContent).toContain('Aún no has agregado cócteles a tus favoritos.');
  });

  it('should update isFavorite flags on favorites change', () => {
    component.cocktailsList.set([{ ...mockCocktail2, isFavorite: true }]);
    fixture.detectChanges();

    // ahora "se borran" favoritos en otra pestaña
    mockFavoritesService.next([]);
    fixture.detectChanges();

    expect(component.cocktailsList()?.[0].isFavorite).toBeFalse();
  });

  it('should filter cocktails by name', () => {
    const filter = { filterBy: 'name', searchInput: 'Margarita' } as FilterModel;
    component.filterCocktails(filter);
    const req = httpMock.expectOne(`${baseApiUrl}search.php?s=Margarita`);
    expect(req.request.method).toBe('GET');
    req.flush({ drinks: [mockCocktail1] });

    expect(component.cocktailsList()).toEqual([jasmine.objectContaining({ idDrink: '11007' })] as any);
    expect(component.loading()).toBeFalse();
  });

  it('should filter cocktails by ingredient', () => {
    const filter = { filterBy: 'ingredient', searchInput: 'Vodka' } as FilterModel;
    const mockFilterResponse = { drinks: [{ idDrink: '12345' }, { idDrink: '67890' }] };
    const mockDetailResponse1 = { drinks: [{ idDrink: '12345', strDrink: 'Vodka Martini' }] };
    const mockDetailResponse2 = { drinks: [{ idDrink: '67890', strDrink: 'Bloody Mary' }] };

    component.filterCocktails(filter);
    const req = httpMock.expectOne(`${baseApiUrl}filter.php?i=Vodka`);
    expect(req.request.method).toBe('GET');
    req.flush(mockFilterResponse);

    const detailReq1 = httpMock.expectOne(`${baseApiUrl}lookup.php?i=12345`);
    expect(detailReq1.request.method).toBe('GET');
    detailReq1.flush(mockDetailResponse1);

    const detailReq2 = httpMock.expectOne(`${baseApiUrl}lookup.php?i=67890`);
    detailReq2.flush(mockDetailResponse2);

    fixture.whenStable().then(() => {
      expect(component.cocktailsList()?.length).toBe(2);
      expect(component.loading()).toBeFalse();
    });
  });

  it('should filter cocktails by ID', () => {
    const filter = { filterBy: 'id', searchInput: '11007' } as FilterModel;
    component.filterCocktails(filter);
    const req = httpMock.expectOne(`${baseApiUrl}lookup.php?i=11007`);
    expect(req.request.method).toBe('GET');
    req.flush({ drinks: [mockCocktail1] });
    expect(component.cocktailsList()).toEqual([jasmine.objectContaining({ idDrink: '11007' })] as any);
    expect(component.loading()).toBeFalse();
  });

  it('should show loading state during filtering', () => {
    const filter = { filterBy: 'name', searchInput: 'Margarita' } as FilterModel;
    component.filterCocktails(filter);
    expect(component.loading()).toBeTrue();
    const req = httpMock.expectOne(`${baseApiUrl}search.php?s=Margarita`);
    req.flush({ drinks: [{ idDrink: '11007', strDrink: 'Margarita' }] });
    expect(component.loading()).toBeFalse();
  });

  it('should show skeletons when loading', () => {
    component.loading.set(true);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const skeletonElements = compiled.querySelectorAll('app-cocktail-item-skeleton');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('should display cocktails when loaded', fakeAsync(() => {
    const mockCocktails = [
      { idDrink: '11007', strDrink: 'Margarita' },
      { idDrink: '11008', strDrink: 'Manhattan' }
    ] as Cocktail[];

    component.cocktailsList.set(mockCocktails);
    component.loading.set(false);
    fixture.detectChanges();

    const viewportDE = fixture.debugElement.query(By.css('cdk-virtual-scroll-viewport'));
    (viewportDE.nativeElement as HTMLElement).style.height = '600px';
    const viewport = viewportDE.injector.get(CdkVirtualScrollViewport);
    viewport.checkViewportSize();
    tick(0);
    fixture.detectChanges();

    expect(viewport.getDataLength()).toBe(2);
    const range = viewport.getRenderedRange();
    expect(range.end - range.start).toBeGreaterThan(0);

    const rendered = (fixture.nativeElement as HTMLElement).querySelectorAll('app-cocktail-item');
    expect(rendered.length).toBeGreaterThan(0);
  }));

  it('should show no results message when cocktail list is empty', () => {
    component.cocktailsList.set([]);
    component.loading.set(false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const noResultsElement = compiled.querySelector('.no-results');
    expect(noResultsElement).toBeTruthy();
  });
});
