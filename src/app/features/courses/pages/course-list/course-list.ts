// course-list.component.ts
import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Course } from '../../models/course.model';
import { CourseFilterComponent } from '../../components/course-filter/course-filter';
import { CourseTableComponent } from '../../components/course-table/course-table';
import { CourseService } from '../../services/course';
import { Toolbar, ToolbarAction } from '../../../../shared/components/toolbar/toolbar.component';
import { MatIconModule } from '@angular/material/icon';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    CourseFilterComponent,
    CourseTableComponent,
    Toolbar,
    MatIconModule,
  ],
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.css'],
})
export class CourseList implements OnInit {
  private courseService = inject(CourseService);
  router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  // Signals
  courses = signal<Course[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  status = signal('');
  selectedCourseId = signal<number | null>(null);

  // Computed - filtered courses
  filteredCourses = computed(() => {
    const allCourses = this.courses();
    const term = this.searchTerm().toLowerCase().trim();
    const selectedStatus = this.status();

    return allCourses.filter((course) => {
      const matchesSearch =
        course.courseName.toLowerCase().includes(term) ||
        course.instructorName?.toLowerCase().includes(term) ||
        course.category?.toLowerCase().includes(term);
      const matchesStatus = !selectedStatus || course.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  });

  // Stats
  totalCourses = computed(() => this.courses().length);
  activeCourses = computed(() => this.courses().filter((c) => c.status === 'active').length);
  draftCourses = computed(() => this.courses().filter((c) => c.status === 'draft').length);
  archivedCourses = computed(() => this.courses().filter((c) => c.status === 'archived').length);

  ngOnInit(): void {
    this.loadCourses();
  }

  // Toolbar actions
  getToolbarActions(): ToolbarAction[] {
    return [
      {
        id: 'add',
        label: 'Add Course',
        icon: 'add',
        color: 'primary',
        type: 'raised',
      },
      {
        id: 'refresh',
        label: 'Refresh',
        icon: 'refresh',
        color: 'accent',
        type: 'stroked',
      },
      {
        id: 'export',
        label: 'Export',
        icon: 'download',
        color: 'primary',
        type: 'stroked',
      },
    ];
  }

  // Handle toolbar actions
  onToolbarAction(action: string) {
    switch (action) {
      case 'add':
        this.goToAdd();
        break;
      case 'refresh':
        this.loadCourses();
        break;
      case 'export':
        this.exportCourses();
        break;
      default:
        console.log('Unknown action:', action);
    }
  }

  loadCourses() {
    this.loading.set(true);
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.loading.set(false);
        this.showMessage('Courses loaded successfully', 'success');
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.loading.set(false);
        this.showMessage('Failed to load courses', 'error');
      },
    });
  }

  onSearch(term: string) {
    this.searchTerm.set(term);
  }

  onStatusChange(status: string) {
    this.status.set(status);
  }

  goToAdd() {
    this.router.navigate(['/courses/new']);
  }

  deleteCourse(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'حذف الكورس',
        message: 'هل أنت متأكد من حذف هذا الكورس؟',
        confirmText: 'نعم، احذف',
        cancelText: 'إلغاء',
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.courseService.deleteCourse(id).subscribe({
          next: () => {
            this.loadCourses();
            this.showMessage('Course deleted successfully', 'success');
          },
          error: (err) => {
            console.error('Error deleting course:', err);
            this.showMessage('Failed to delete course', 'error');
          },
        });
      }
    });
  }

  exportCourses() {
    const courses = this.filteredCourses();
    if (courses.length === 0) {
      this.showMessage('No courses to export', 'warning');
      return;
    }

    // Create CSV data
    const headers = ['ID', 'Course Name', 'Instructor', 'Category', 'Status', 'Price', 'Duration'];
    const csvData = courses.map((c) => [
      c.id,
      c.courseName,
      c.instructorName,
      c.category,
      c.status,
      c.price,
      c.duration,
    ]);

    const csvContent = [headers.join(','), ...csvData.map((row) => row.join(','))].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courses_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    this.showMessage(`Exported ${courses.length} courses successfully`, 'success');
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
