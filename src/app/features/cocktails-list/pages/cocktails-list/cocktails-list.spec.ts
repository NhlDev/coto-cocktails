import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, RouterLink } from '@angular/router';

import { CocktailsList } from './cocktails-list';
import { Cocktails } from '../../../../core/services';
import { BASE_API_URL } from '../../../../core';
import { FilterModel } from '../../types';
import { Cocktail } from '../../../../core/types';

describe('CocktailsList', () => {
  let component: CocktailsList;
  let fixture: ComponentFixture<CocktailsList>;
  const baseApiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/';
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailsList, HttpClientTestingModule, ScrollingModule, RouterLink],
      providers: [
        Cocktails,
        { provide: BASE_API_URL, useValue: baseApiUrl },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '11007' }) } } }
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(CocktailsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial states', () => {
    expect(component.showFiltersPanel()).toBeTrue();
    expect(component.cocktailsList()).toBeNull();
    expect(component.loading()).toBeFalse();
  });

  it('should toggle filters panel', () => {
    const initialState = component.showFiltersPanel();
    component.toggleFiltersPanel();
    expect(component.showFiltersPanel()).toBe(!initialState);
  });

  it('should filter cocktails by name', (done) => {
    const filter = { filterBy: 'name', searchInput: 'Margarita' } as FilterModel;
    const mockResponse = { drinks: [{ idDrink: '11007', strDrink: 'Margarita' }] };
    component.filterCocktails(filter);
    const req = httpMock.expectOne(`${baseApiUrl}search.php?s=Margarita`);
    expect(req.request.method).toBe('GET');
    req.flush({ drinks: [{ idDrink: '11007', strDrink: 'Margarita' }] });

    expect(component.cocktailsList()).toEqual(mockResponse.drinks as Cocktail[]);
    expect(component.loading()).toBeFalse();
    done();
  });

  it('should filter cocktails by ingredient', (done) => {
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
    expect(detailReq2.request.method).toBe('GET');
    detailReq2.flush(mockDetailResponse2);

    expect(component.cocktailsList()).toEqual([
      { idDrink: '12345', strDrink: 'Vodka Martini' },
      { idDrink: '67890', strDrink: 'Bloody Mary' }
    ] as Cocktail[]);
    expect(component.loading()).toBeFalse();
    done();
  });

  it('should filter cocktails by ID', (done) => {
    const filter = { filterBy: 'id', searchInput: '11007' } as FilterModel;
    const mockResponse = { drinks: [{ idDrink: '11007', strDrink: 'Margarita' }] };
    component.filterCocktails(filter);
    const req = httpMock.expectOne(`${baseApiUrl}lookup.php?i=11007`);
    expect(req.request.method).toBe('GET');
    req.flush({ drinks: [{ idDrink: '11007', strDrink: 'Margarita' }] });
    expect(component.cocktailsList()).toEqual(mockResponse.drinks as Cocktail[]);
    expect(component.loading()).toBeFalse();
    done();
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

    // asegurar tamaño del viewport y forzar medición
    const viewportDE = fixture.debugElement.query(By.css('cdk-virtual-scroll-viewport'));
    (viewportDE.nativeElement as HTMLElement).style.height = '600px';
    const viewport = viewportDE.injector.get(CdkVirtualScrollViewport);
    viewport.checkViewportSize();
    tick(0); // permite al CDK completar el render
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
