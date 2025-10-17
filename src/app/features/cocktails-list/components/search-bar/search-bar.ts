import { Component, inject, output, } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FilterModel } from '../../types';

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
export class SearchBar {
  private fb = inject(FormBuilder);

  filters = output<FilterModel>();

  searchFormGroup = this.fb.group({
    searchInput: ['', [Validators.required, Validators.maxLength(50)]],
    filterBy: ['name', [Validators.required]],
  });

  onSubmit() {
    if (this.searchFormGroup.invalid) return;

    const filter: FilterModel = this.searchFormGroup.value as FilterModel;
    this.filters.emit(filter);
  }
}
