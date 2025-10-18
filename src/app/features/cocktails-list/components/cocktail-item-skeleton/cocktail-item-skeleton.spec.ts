import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocktailItemSkeleton } from './cocktail-item-skeleton';

describe('CocktailItemSkeleton', () => {
  let component: CocktailItemSkeleton;
  let fixture: ComponentFixture<CocktailItemSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocktailItemSkeleton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocktailItemSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have skeleton elements', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const skeletonElements = compiled.querySelectorAll('.skeleton');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });
});
