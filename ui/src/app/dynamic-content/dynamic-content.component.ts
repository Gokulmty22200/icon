import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-content',
  standalone: true,
  imports: [],
  templateUrl: './dynamic-content.component.html',
  styleUrl: './dynamic-content.component.scss'
})
export class DynamicContentComponent {
  @Input() content: string;
}
