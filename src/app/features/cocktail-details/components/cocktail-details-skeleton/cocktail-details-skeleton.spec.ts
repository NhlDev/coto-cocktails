import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailDetailsSkeleton } from './cocktail-details-skeleton';

describe('CocktailDetailsSkeleton', () => {
  let component: CocktailDetailsSkeleton;
  let fixture: ComponentFixture<CocktailDetailsSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailDetailsSkeleton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocktailDetailsSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
