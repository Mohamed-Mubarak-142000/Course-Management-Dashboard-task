import { InfoItemComponent } from './../../../../shared/components/info-item/info-item';
// course-details.component.ts
import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CourseService } from '../../services/course';
import { Course } from '../../models/course.model';
import { Toolbar, ToolbarAction } from '../../../../shared/components/toolbar/toolbar.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { StatusChipComponent } from '../../../../shared/components/status-chip/status-chip';
import { LoadingComponent } from '../../../../shared/components/loading/loading';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule,
    Toolbar,
    // StatusChipComponent,
    LoadingComponent,
    ErrorStateComponent,
    InfoItemComponent,
    EmptyStateComponent,
  ],
  templateUrl: './course-details.html',
  styleUrls: ['./course-details.css'],
})
export class CourseDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  course = signal<Course | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadCourse();
  }

  private loadCourse() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('Invalid course ID');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.courseService.getCourseById(id).subscribe({
      next: (data) => {
        if (data) {
          this.course.set(data);
        } else {
          this.error.set('Course not found');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading course:', err);
        this.error.set('An error occurred while loading the course data');
        this.loading.set(false);
      },
    });
  }

  // Toolbar actions with direct action handlers
  getToolbarActions(): ToolbarAction[] {
    return [
      {
        id: 'edit',
        label: 'Edit',
        icon: 'edit',
        color: 'primary',
        type: 'raised',
        action: () => this.editCourse(),
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: 'delete',
        color: 'warn',
        type: 'stroked',
        action: () => this.deleteCourse(),
      },
    ];
  }

  editCourse() {
    const id = this.course()?.id;
    if (id) {
      this.router.navigate(['/courses/edit', id]);
    } else {
      this.showMessage('Course ID not found', 'error');
    }
  }

  deleteCourse() {
    const courseId = this.course()?.id;
    if (!courseId) {
      this.showMessage('Course ID not found', 'error');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '420px',
      data: {
        title: 'Delete Course',
        message: `Are you sure you want to delete "${this.course()?.courseName}"? This action cannot be undone.`,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.courseService.deleteCourse(courseId).subscribe({
          next: () => {
            this.showMessage('Course deleted successfully', 'success');
            this.router.navigate(['/courses']);
          },
          error: (err) => {
            console.error('Error deleting course:', err);
            this.showMessage('Failed to delete course', 'error');
          },
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/courses']);
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

  // Computed states
  showLoadingMessage = computed(() => this.loading() && !this.course() && !this.error());
  hasError = computed(() => !!this.error());
  showCourseData = computed(() => !this.loading() && !!this.course() && !this.error());
}
