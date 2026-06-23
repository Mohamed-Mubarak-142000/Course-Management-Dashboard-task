import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { CourseStatus } from '../../../features/courses/models/course.model';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  templateUrl: './status-chip.html',
  styleUrls: ['./status-chip.css'],
})
export class StatusChipComponent {
  @Input() status: CourseStatus | null = null;

  get chipClass(): string {
    switch (this.status) {
      case CourseStatus.Active:
        return 'status-active';
      case CourseStatus.Draft:
        return 'status-draft';
      case CourseStatus.Archived:
        return 'status-archived';

      default:
        return 'status-default';
    }
  }

  get label(): string {
    return this.status || 'Unknown';
  }
}
