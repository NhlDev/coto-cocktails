import { Component, inject } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

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

  searchFormGroup = this.fb.group({
    searchInput: ['', [Validators.required, Validators.maxLength(50)]],
    filterBy: ['name', [Validators.required]],
  });

  onSubmit() {
    if (this.searchFormGroup.invalid) return;

    debugger;
    const formValue = this.searchFormGroup.value;
    console.log('Form submitted with value:', formValue);
  }
}
