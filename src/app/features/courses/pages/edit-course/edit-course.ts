import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course';
import { Toolbar } from '../../../../shared/components/toolbar/toolbar.component';
import { Course } from '../../models/course.model';
import { CommonModule } from '@angular/common';
import { CourseForm } from '../../components/course-form/course.form';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-course-edit',
  standalone: true,
  imports: [CommonModule, Toolbar, CourseForm],
  templateUrl: './edit-course.html',
})
export class CourseEdit implements OnInit {
  @ViewChild('formRef') formComponent!: CourseForm;

  course?: Course;
  courseId!: number;
  isLoading = true;
  error: string | null = null;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'معرف الدورة غير موجود';
      this.isLoading = false;
      return;
    }

    this.courseId = Number(id);

    if (isNaN(this.courseId)) {
      this.error = 'معرف الدورة غير صحيح';
      this.isLoading = false;
      return;
    }

    this.loadCourse();
  }

  loadCourse() {
    this.isLoading = true;
    this.error = null;

    this.courseService.getCourseById(this.courseId).subscribe({
      next: (data) => {
        console.log('Course data received:', data); // للتأكد من وصول البيانات
        this.course = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // فرض تحديث العرض
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.error = 'حدث خطأ أثناء تحميل بيانات الدورة';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSave(course: Course) {
    this.isLoading = true;
    this.error = null;

    this.courseService.updateCourse(this.courseId, course).subscribe({
      next: () => {
        this.router.navigate(['/courses']);
        this.showMessage('Course updated successfully', 'success');
      },
      error: (error) => {
        console.error('Error updating course:', error);
        this.error = 'حدث خطأ أثناء حفظ التغييرات';
        this.isLoading = false;
        this.cdr.detectChanges();
        this.showMessage('Failed to update course', 'error');
      },
    });
  }

  goBack() {
    this.router.navigate(['/courses']);
  }

  triggerSave() {
    if (this.formComponent) {
      this.formComponent.submit();
    }
  }

  private showMessage(message: string, type: 'success' | 'error' | 'warning') {
    const panelClass = `snackbar-${type}`;
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [panelClass],
    });
  }
}
