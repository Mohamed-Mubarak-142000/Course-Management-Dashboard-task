import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-info-item',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './info-item.html',
  styleUrls: ['./info-item.css'],
})
export class InfoItemComponent {
  @Input() icon = '';
  @Input() label = '';
  @Input() value: string | number | null | undefined = '';
}
