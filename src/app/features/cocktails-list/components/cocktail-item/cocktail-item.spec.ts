import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailItem } from './cocktail-item';

describe('CocktailItem', () => {
  let component: CocktailItem;
  let fixture: ComponentFixture<CocktailItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocktailItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
