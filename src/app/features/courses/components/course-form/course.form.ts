import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { Course, CourseStatus } from '../../models/course.model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './course.form.html',
})
export class CourseForm implements OnChanges {
  @Input() course?: Course;
  @Output() save = new EventEmitter<Course>();
  CourseStatus = CourseStatus;

  form = new FormGroup({
    courseName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    instructorName: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    duration: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    status: new FormControl<CourseStatus>(CourseStatus.Active, [Validators.required]),
    description: new FormControl(''),
  });

  // 🔥 FIX: update when input changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes['course'] && this.course) {
      this.form.patchValue(this.course);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit({
      ...this.course,
      ...this.form.value,
      createdDate: this.course?.createdDate || new Date().toISOString(),
    } as Course);
  }
}
