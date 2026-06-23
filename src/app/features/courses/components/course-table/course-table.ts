// course-table.component.ts (إضافة outputs)
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Course } from '../../models/course.model';
import { StatusChipComponent } from '../../../../shared/components/status-chip/status-chip';

@Component({
  selector: 'app-course-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    StatusChipComponent,
  ],
  templateUrl: './course-table.html',
  styleUrls: ['./course-table.css'],
})
export class CourseTableComponent {
  @Input() courses: Course[] = [];
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() view = new EventEmitter<number>();

  displayedColumns: string[] = [
    'id',
    'courseName',
    'instructorName',
    'category',
    'status',
    'price',
    'actions',
  ];

  getStatusClass(status: string): string {
    return `status-${status?.toLowerCase() || 'unknown'}`;
  }
}
