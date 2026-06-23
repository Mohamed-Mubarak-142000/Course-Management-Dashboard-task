import { Component, ViewChild, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseService } from '../../services/course';
import { Toolbar, ToolbarAction } from '../../../../shared/components/toolbar/toolbar.component';
import { Course } from '../../models/course.model';
import { CourseForm } from '../../components/course-form/course.form';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-course-edit',
  standalone: true,
  imports: [
    CommonModule,
    Toolbar,
    CourseForm,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './edit-course.html',
  styleUrls: ['./edit-course.css'],
})
export class CourseEdit implements OnInit {
  @ViewChild('formRef') formComponent!: CourseForm;

  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);

  course?: Course;
  courseId!: number;
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Course ID not found';
      this.isLoading = false;
      return;
    }

    this.courseId = Number(id);

    if (isNaN(this.courseId)) {
      this.error = 'Invalid course ID';
      this.isLoading = false;
      return;
    }

    this.loadCourse();
  }

  // Toolbar actions with direct action handlers
  getToolbarActions(): ToolbarAction[] {
    return [
      {
        id: 'save',
        label: 'Save Changes',
        icon: 'save',
        color: 'primary',
        type: 'raised',
        action: () => this.triggerSave(),
        tooltip: 'Save course changes',
        disabled:
          this.isLoading ||
          !!this.error ||
          !this.formComponent?.isValid?.() ||
          !this.formComponent?.hasUnsavedChanges?.(),
      },
      {
        id: 'reset',
        label: 'Reset',
        icon: 'refresh',
        color: 'warn',
        type: 'stroked',
        action: () => this.resetForm(),
        tooltip: 'Reset form to original values',
        disabled: this.isLoading || !!this.error || !this.formComponent?.hasUnsavedChanges?.(),
      },
    ];
  }

  loadCourse() {
    this.isLoading = true;
    this.error = null;

    this.courseService.getCourseById(this.courseId).subscribe({
      next: (data) => {
        console.log('Course data received:', data);
        this.course = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.error = 'An error occurred while loading course data';
        this.isLoading = false;
        this.cdr.detectChanges();
        this.showMessage('Failed to load course data', 'error');
      },
    });
  }

  onSave(course: Course) {
    this.isLoading = true;
    this.error = null;

    this.courseService.updateCourse(this.courseId, course).subscribe({
      next: () => {
        this.isLoading = false;
        this.showMessage('Course updated successfully', 'success');
        this.router.navigate(['/courses']);
      },
      error: (error) => {
        console.error('Error updating course:', error);
        this.error = 'An error occurred while saving changes';
        this.isLoading = false;
        this.cdr.detectChanges();
        this.showMessage('Failed to update course', 'error');
      },
    });
  }

  goBack() {
    // Check if form has unsaved changes
    if (this.formComponent?.hasUnsavedChanges?.()) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        this.router.navigate(['/courses']);
      }
    } else {
      this.router.navigate(['/courses']);
    }
  }

  triggerSave() {
    if (this.formComponent) {
      // Check if form is valid before submitting
      if (this.formComponent.isValid?.()) {
        this.formComponent.submit();
      } else {
        this.showMessage('Please fill in all required fields correctly', 'warning');
        // Trigger validation display
        this.formComponent.markAllAsTouched?.();
      }
    } else {
      this.showMessage('Form not ready', 'warning');
    }
  }

  resetForm() {
    if (this.formComponent?.hasUnsavedChanges?.()) {
      if (confirm('Are you sure you want to reset the form? All changes will be lost.')) {
        this.formComponent.resetForm?.();
        this.showMessage('Form has been reset to original values', 'info');
      }
    } else {
      this.formComponent?.resetForm?.();
      this.showMessage('Form has been reset to original values', 'info');
    }
  }

  retryLoading() {
    this.loadCourse();
  }

  private showMessage(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    const panelClass = `snackbar-${type}`;
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
}
