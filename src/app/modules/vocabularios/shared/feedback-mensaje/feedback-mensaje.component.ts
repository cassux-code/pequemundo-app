import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoFeedback } from '../../types/vocabulario.types';

@Component({
  selector: 'app-feedback-mensaje',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback-mensaje.component.html',
  styleUrls: ['./feedback-mensaje.component.css'],
})
export class FeedbackMensajeComponent {
  @Input() tipo: TipoFeedback = '';
  @Input() mensaje = '';

  get icono(): string {
    return this.tipo === 'exito' ? '✅' : this.tipo === 'error' ? '🔁' : this.tipo === 'pista' ? '💡' : '';
  }
}
