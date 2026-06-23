import { Component, Output, EventEmitter, signal, effect } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-course-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './course-filter.html',
})
export class CourseFilterComponent {
  // ✅ Signals instead of normal variables
  searchTerm = signal('');
  status = signal('');

  // Still using Output to parent (best practice for simple apps)
  @Output() searchChanged = new EventEmitter<string>();
  @Output() statusChanged = new EventEmitter<string>();

  constructor() {
    // 👇 Auto react when search changes
    effect(() => {
      this.searchChanged.emit(this.searchTerm());
    });

    // 👇 Auto react when status changes
    effect(() => {
      this.statusChanged.emit(this.status());
    });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  onStatusChange(value: string) {
    this.status.set(value);
  }
}
