import { TestBed } from '@angular/core/testing';
import { Cocktails } from './cocktails';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BASE_API_URL } from '../..';


describe('Cocktails', () => {
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
});
