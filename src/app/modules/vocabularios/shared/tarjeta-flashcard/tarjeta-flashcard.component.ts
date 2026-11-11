import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tarjeta-flashcard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tarjeta-flashcard.component.html',
  styleUrls: ['./tarjeta-flashcard.component.css'],
})
export class TarjetaFlashcardComponent {
  @Input() imagen = '';
  @Input() texto = '';
  @Input() volteada = false;
  @Output() voltear = new EventEmitter<void>();
}
