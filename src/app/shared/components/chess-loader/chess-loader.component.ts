import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chess-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chess-loader.component.html',
  styleUrl: './chess-loader.component.css'
})
export class ChessLoaderComponent {
  @Input() message: string = 'Loading...';
}
