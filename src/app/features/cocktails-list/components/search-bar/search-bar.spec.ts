import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBar]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filters on form submit', () => {
    spyOn(component.filters, 'emit');

    component.searchFormGroup.setValue({
      searchInput: 'Cerveza corona',
      filterBy: 'name',
    });

    component.onSubmit();

    expect(component.filters.emit).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should not emit filters if form is invalid', () => {
    spyOn(component.filters, 'emit');

    component.searchFormGroup.setValue({
      searchInput: null,
      filterBy: 'name',
    });

    component.onSubmit();

    expect(component.filters.emit).not.toHaveBeenCalled();
  });

  it('should validate searchInput max length', () => {
    component.searchFormGroup.setValue({
      searchInput: 'A'.repeat(51),
      filterBy: 'name',
    });
    expect(component.searchFormGroup.invalid).toBeTrue();
  });

  it('submit button should be disabled if form is invalid', () => {
    component.searchFormGroup.setValue({
      searchInput: '',
      filterBy: 'name',
    });
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBeTrue();
  });

  it('if filterBy is "id", searchInput type should be number', () => {
    component.searchFormGroup.get('filterBy')?.setValue('id');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="searchInput"]');
    expect(input.type).toBe('number');
  });

  it('if filterBy is not "id", searchInput type should be text', () => {
    component.searchFormGroup.get('filterBy')?.setValue('name');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input[formControlName="searchInput"]');
    expect(input.type).toBe('text');
  });

});
