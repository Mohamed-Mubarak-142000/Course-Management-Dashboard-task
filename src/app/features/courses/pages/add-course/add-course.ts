// add-course.component.ts
import { Component, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course';
import { CourseForm } from '../../components/course-form/course.form';
import { Toolbar, ToolbarAction } from '../../../../shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-course-add',
  standalone: true,
  imports: [CommonModule, CourseForm, Toolbar],
  templateUrl: './add-course.html',
  styleUrls: ['./add-course.css'],
})
export class CourseAddComponent {
  private courseService = inject(CourseService);
  private router = inject(Router);

  @ViewChild('formRef') formComponent: any;

  // Define toolbar actions
  getToolbarActions(): ToolbarAction[] {
    return [
      {
        id: 'save',
        label: 'Save Course',
        icon: 'save',
        color: 'primary',
        type: 'raised',
      },
      {
        id: 'preview',
        label: 'Preview',
        icon: 'visibility',
        color: 'accent',
        type: 'stroked',
      },
      {
        id: 'reset',
        label: 'Reset',
        icon: 'refresh',
        color: 'warn',
        type: 'stroked',
      },
    ];
  }

  // Handle all toolbar actions
  onToolbarAction(action: string) {
    switch (action) {
      case 'back':
        this.goBack();
        break;
      case 'save':
        this.triggerSave();
        break;
      case 'preview':
        this.previewCourse();
        break;
      case 'reset':
        this.resetForm();
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  onSave(course: any) {
    this.courseService.addCourse(course).subscribe({
      next: () => {
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        console.error('Error saving course:', err);
        // Handle error - show message to user
      },
    });
  }

  goBack() {
    this.router.navigate(['/courses']);
  }

  triggerSave() {
    this.formComponent?.submit();
  }

  previewCourse() {
    const formData = this.formComponent?.getFormData();
    if (formData) {
      console.log('Preview course data:', formData);
      // You can open a preview dialog or navigate to preview page
      alert('Preview course: ' + JSON.stringify(formData, null, 2));
    }
  }

  resetForm() {
    if (confirm('Are you sure you want to reset the form?')) {
      this.formComponent?.resetForm();
    }
  }
}
