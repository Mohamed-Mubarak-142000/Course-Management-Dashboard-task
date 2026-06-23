import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ToolbarAction {
  id: string;
  label: string;
  icon?: string;
  color?: 'primary' | 'accent' | 'warn';
  type?: 'raised' | 'stroked' | 'flat' | 'icon';
  disabled?: boolean;
  tooltip?: string;
  action?: () => void;
}

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class Toolbar {
  @Input() title = '';
  @Input() showBack = false;
  @Input() actions: ToolbarAction[] = [];
  @Input() showMenu = false;
  location = inject(Location);
  @Output() back = new EventEmitter<void>();

  onAction(action: ToolbarAction): void {
    action.action?.();
  }

  onBack(): void {
    this.location.back();
  }
}
