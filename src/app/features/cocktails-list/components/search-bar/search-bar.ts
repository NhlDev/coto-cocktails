import { Component, effect, inject, input, OnInit, output, } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FilterModel } from '../../types';

const sessionStorageKey = 'cocktails-list-filters';

@Component({
  selector: 'app-search-bar',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
  ],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss'
})
export class SearchBar implements OnInit {
  private fb = inject(FormBuilder);

  initialFilters = input<FilterModel | null>({
    searchInput: '',
    filterBy: 'name',
  });
  filters = output<FilterModel>();

  searchFormGroup = this.fb.group({
    searchInput: ['', [Validators.required, Validators.maxLength(50)]],
    filterBy: ['name', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const filters = this.initialFilters();
      if (!filters) return;

      this.searchFormGroup.setValue({
        searchInput: filters.searchInput,
        filterBy: filters.filterBy,
      }, { emitEvent: true });
    });
  }
  
  ngOnInit(): void {
    const savedFilters = sessionStorage.getItem(sessionStorageKey);
    if (savedFilters) {
      this.searchFormGroup.setValue(JSON.parse(savedFilters), { emitEvent: false });
      this.onSubmit();
    }
  }

  onSubmit() {
    if (this.searchFormGroup.invalid) return;
    const filter: FilterModel = this.searchFormGroup.value as FilterModel;
    sessionStorage.setItem(sessionStorageKey, JSON.stringify(filter));
    this.filters.emit(filter);
  }
}
