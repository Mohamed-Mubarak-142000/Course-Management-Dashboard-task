import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
  ],
  templateUrl: './course.form.html',
  styleUrls: ['./course.form.css'],
})
export class CourseForm implements OnChanges {
  @Input() course?: Course;
  @Output() save = new EventEmitter<Course>();
  CourseStatus = CourseStatus;

  form = new FormGroup({
    courseName: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    instructorName: new FormControl<string>('', [Validators.required]),
    category: new FormControl<string>('', [Validators.required]),
    duration: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    status: new FormControl<CourseStatus>(CourseStatus.Active, [Validators.required]),
    description: new FormControl<string>(''),
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes['course'] && this.course) {
      // Patch values with proper type handling
      this.form.patchValue({
        courseName: this.course.courseName || '',
        instructorName: this.course.instructorName || '',
        category: this.course.category || '',
        duration: this.course.duration || null,
        price: this.course.price || null,
        status: this.course.status || CourseStatus.Active,
        description: this.course.description || '',
      });
      this.form.markAsPristine();
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Build course object with proper type handling
    const formValue = this.form.value;
    const courseData: Course = {
      id: this.course?.id || 0,
      courseName: formValue.courseName || '',
      instructorName: formValue.instructorName || '',
      category: formValue.category || '',
      duration: formValue.duration || 0,
      price: formValue.price || 0,
      status: formValue.status || CourseStatus.Active,
      description: formValue.description || '',
      createdDate: this.course?.createdDate || new Date().toISOString(),
    };

    this.save.emit(courseData);
  }

  // ===== PUBLIC METHODS =====

  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }

  isValid(): boolean {
    return this.form.valid;
  }

  markAllAsTouched(): void {
    this.form.markAllAsTouched();
  }

  resetForm(): void {
    if (this.course) {
      // Reset to the original course data
      this.form.reset({
        courseName: this.course.courseName || '',
        instructorName: this.course.instructorName || '',
        category: this.course.category || '',
        duration: this.course.duration || null,
        price: this.course.price || null,
        status: this.course.status || CourseStatus.Active,
        description: this.course.description || '',
      });
    } else {
      // Reset to default values
      this.form.reset({
        courseName: '',
        instructorName: '',
        category: '',
        duration: null,
        price: null,
        status: CourseStatus.Active,
        description: '',
      });
    }
    this.form.markAsPristine();
  }

  getFormData(): Course | null {
    if (this.form.invalid) {
      return null;
    }

    const formValue = this.form.value;
    return {
      id: this.course?.id || 0,
      courseName: formValue.courseName || '',
      instructorName: formValue.instructorName || '',
      category: formValue.category || '',
      duration: formValue.duration || 0,
      price: formValue.price || 0,
      status: formValue.status || CourseStatus.Active,
      description: formValue.description || '',
      createdDate: this.course?.createdDate || new Date().toISOString(),
    };
  }

  getRawFormData(): Partial<Course> {
    const formValue = this.form.value;
    return {
      id: this.course?.id,
      courseName: formValue.courseName || undefined,
      instructorName: formValue.instructorName || undefined,
      category: formValue.category || undefined,
      duration: formValue.duration || undefined,
      price: formValue.price || undefined,
      status: formValue.status || undefined,
      description: formValue.description || undefined,
      createdDate: this.course?.createdDate,
    };
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return '';

    const errors = control.errors;
    const errorMessages: string[] = [];

    if (errors['required']) {
      errorMessages.push('This field is required');
    }
    if (errors['minlength']) {
      errorMessages.push(`Minimum length is ${errors['minlength'].requiredLength} characters`);
    }
    if (errors['min']) {
      errorMessages.push(`Minimum value is ${errors['min'].min}`);
    }
    if (errors['max']) {
      errorMessages.push(`Maximum value is ${errors['max'].max}`);
    }
    if (errors['pattern']) {
      errorMessages.push('Invalid format');
    }

    return errorMessages.join('. ');
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    const controls = this.form.controls;

    for (const [key, control] of Object.entries(controls)) {
      if (control.errors && (control.dirty || control.touched)) {
        const label = this.getFieldLabel(key);
        const errorMessage = this.getErrorMessage(key);
        errors.push(`${label}: ${errorMessage}`);
      }
    }

    return errors;
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      courseName: 'Course Name',
      instructorName: 'Instructor Name',
      category: 'Category',
      duration: 'Duration',
      price: 'Price',
      status: 'Status',
      description: 'Description',
    };
    return labels[fieldName] || fieldName;
  }

  resetAndKeepPristine(): void {
    this.resetForm();
    this.form.markAsPristine();
  }

  validateAndShowErrors(): boolean {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true;
  }

  hasAnyError(): boolean {
    return (
      this.form.invalid &&
      Object.values(this.form.controls).some((control) => control.touched && control.errors)
    );
  }
}
