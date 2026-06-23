// toolbar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  @Output() action = new EventEmitter<string>();
  @Output() back = new EventEmitter<void>();

  onAction(actionId: string) {
    this.action.emit(actionId);
  }

  onBack() {
    this.back.emit();
  }

  getButtonType(type?: string): string {
    return type || 'flat';
  }
}
