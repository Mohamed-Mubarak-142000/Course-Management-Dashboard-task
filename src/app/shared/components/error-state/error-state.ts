import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './error-state.html',
  styleUrls: ['./error-state.css'],
})
export class ErrorStateComponent {
  @Input() title = 'Something went wrong';
  @Input() message = 'An unexpected error occurred. Please try again later.';
  @Input() buttonText = 'Try Again';

  @Output() retry = new EventEmitter<void>();

  onRetry() {
    this.retry.emit();
  }
}
