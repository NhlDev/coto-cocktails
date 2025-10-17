import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailsList } from './cocktails-list';
import { Cocktails } from '../../../../core/services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BASE_API_URL } from '../../../../core';


describe('CocktailsList', () => {
  let component: CocktailsList;
  let fixture: ComponentFixture<CocktailsList>;
  const baseApiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailsList, HttpClientTestingModule],
      providers: [
        Cocktails,
        { provide: BASE_API_URL, useValue: baseApiUrl }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CocktailsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
