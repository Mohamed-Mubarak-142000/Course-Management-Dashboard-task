import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './loading.html',
  styleUrls: ['./loading.css'],
})
export class LoadingComponent {
  @Input() title = 'Loading...';
  @Input() subtitle = 'Please wait...';
  @Input() diameter = 48;
  @Input() showCard = true;
}
