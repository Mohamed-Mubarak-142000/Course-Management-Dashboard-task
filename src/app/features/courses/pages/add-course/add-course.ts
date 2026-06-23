// add-course.component.ts
import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CourseService } from '../../services/course';
import { CourseForm } from '../../components/course-form/course.form';
import { Toolbar, ToolbarAction } from '../../../../shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-course-add',
  standalone: true,
  imports: [CommonModule, CourseForm, Toolbar, MatSnackBarModule],
  templateUrl: './add-course.html',
  styleUrls: ['./add-course.css'],
})
export class CourseAddComponent {
  private courseService = inject(CourseService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  @ViewChild('formRef') formComponent: any;

  // Define toolbar actions with direct action handlers
  getToolbarActions(): ToolbarAction[] {
    return [
      {
        id: 'save',
        label: 'Save Course',
        icon: 'save',
        color: 'primary',
        type: 'raised',
        action: () => this.triggerSave(),
      },
      {
        id: 'reset',
        label: 'Reset',
        icon: 'refresh',
        color: 'warn',
        type: 'stroked',
        action: () => this.resetForm(),
      },
    ];
  }

  onSave(course: any) {
    this.courseService.addCourse(course).subscribe({
      next: () => {
        this.snackBar.open('Course saved successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-success'],
        });
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        console.error('Error saving course:', err);
        this.snackBar.open('Failed to save course. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  goBack() {
    // Check if form has unsaved changes
    if (this.formComponent?.hasUnsavedChanges()) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        this.router.navigate(['/courses']);
      }
    } else {
      this.router.navigate(['/courses']);
    }
  }

  triggerSave() {
    if (this.formComponent) {
      this.formComponent.submit();
    } else {
      this.snackBar.open('Form not ready', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-warning'],
      });
    }
  }

  previewCourse() {
    const formData = this.formComponent?.getFormData();
    if (formData) {
      // Check if form is valid
      if (this.formComponent?.isValid()) {
        console.log('Preview course data:', formData);
        // You can open a preview dialog or navigate to preview page
        const previewMessage =
          `📚 Course Preview\n\n` +
          `Name: ${formData.courseName || 'N/A'}\n` +
          `Instructor: ${formData.instructorName || 'N/A'}\n` +
          `Category: ${formData.category || 'N/A'}\n` +
          `Status: ${formData.status || 'N/A'}\n` +
          `Price: $${formData.price || '0'}\n` +
          `Duration: ${formData.duration || 'N/A'} hours\n\n` +
          `Description: ${formData.description || 'No description provided'}`;

        alert(previewMessage);
      } else {
        this.snackBar.open('Please fill in all required fields before previewing', 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-warning'],
        });
      }
    } else {
      this.snackBar.open('No form data available to preview', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-warning'],
      });
    }
  }

  resetForm() {
    if (this.formComponent?.hasUnsavedChanges()) {
      if (confirm('Are you sure you want to reset the form? All changes will be lost.')) {
        this.formComponent?.resetForm();
        this.snackBar.open('Form has been reset', 'Close', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['snackbar-info'],
        });
      }
    } else {
      this.formComponent?.resetForm();
      this.snackBar.open('Form has been reset', 'Close', {
        duration: 2000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['snackbar-info'],
      });
    }
  }
}
