import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Cocktails } from './cocktails';
import { BASE_API_URL } from '../../tokens';
import { Cocktail } from '../../types';


describe('Cocktails Service', () => {
  let service: Cocktails;
  let httpMock: HttpTestingController;
  const baseApiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Cocktails,
        { provide: BASE_API_URL, useValue: baseApiUrl }
      ],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(Cocktails);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // query string y respuesta mock común para todas las pruebas
  const TestQueryString = 'TEST-QUERY-STRING-PARAMETER';
  const mockResponseArray: { drinks: Partial<Cocktail>[] } = { // Al tipo cocktail lo hacemos Partial para no tener que definir todos los campos
    drinks: [
      { idDrink: '1', strDrink: 'Mojito' },
      { idDrink: '2', strDrink: 'Martini' }
    ]
  };
  const emptyMockResponse: { drinks: null } = { drinks: null };

  describe('searchByName', () => {

    it('should fetch cocktails by name successfully', () => {
      service.searchByName(TestQueryString).subscribe(cocktails => {
        expect(cocktails).toEqual(mockResponseArray.drinks as Cocktail[]);
      });

      const request = httpMock.expectOne(`${baseApiUrl}search.php?s=${TestQueryString}`);
      expect(request.request.method).toBe('GET');
      request.flush(mockResponseArray);
    });

    it('should return an empty array when no cocktails are found', () => {
      service.searchByName(TestQueryString).subscribe(cocktails => {
        expect(cocktails).toEqual([]);
      });

      const request = httpMock.expectOne(`${baseApiUrl}search.php?s=${TestQueryString}`);
      expect(request.request.method).toBe('GET');
      request.flush(emptyMockResponse);
    });
  });

  describe('searchByIngredient', () => {

    it('should fetch cocktails by ingredient successfully', () => {
      service.searchByIngredient(TestQueryString).subscribe(cocktails => {
        expect(cocktails).toEqual(mockResponseArray.drinks as Cocktail[]);
      });

      const requestIngredients = httpMock.expectOne(`${baseApiUrl}filter.php?i=${TestQueryString}`);
      expect(requestIngredients.request.method).toBe('GET');
      requestIngredients.flush(mockResponseArray);

      // Simular las llamadas internas a searchByID para cada idDrink
      mockResponseArray.drinks?.forEach(drink => {
        const requestByID = httpMock.expectOne(`${baseApiUrl}lookup.php?i=${drink.idDrink}`);
        expect(requestByID.request.method).toBe('GET');
        requestByID.flush({
          drinks: [drink]
        });
      });
    });

    it('should return an empty array when no cocktails are found', () => {
      service.searchByIngredient(TestQueryString).subscribe(cocktails => {
        expect(cocktails).toEqual([]);
      });

      const request = httpMock.expectOne(`${baseApiUrl}filter.php?i=${TestQueryString}`);
      expect(request.request.method).toBe('GET');
      request.flush(emptyMockResponse);
    });
  });


  describe('searchByID', () => {
    const randomId = Date.now();

    it('should fetch cocktails by ID successfully', () => {
      service.searchByID(randomId).subscribe(cocktails => {
        expect(cocktails).toEqual(mockResponseArray.drinks as Cocktail[]);
      });

      const request = httpMock.expectOne(`${baseApiUrl}lookup.php?i=${randomId}`);
      expect(request.request.method).toBe('GET');
      request.flush(mockResponseArray);
    });

    it('should return an empty array when no cocktails are found', () => {
      service.searchByID(randomId).subscribe(cocktails => {
        expect(cocktails).toEqual([]);
      });

      const request = httpMock.expectOne(`${baseApiUrl}lookup.php?i=${randomId}`);
      expect(request.request.method).toBe('GET');
      request.flush(emptyMockResponse);
    });
  });

});
