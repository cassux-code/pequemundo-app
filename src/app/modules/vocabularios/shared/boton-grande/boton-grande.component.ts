import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type VarianteBoton = 'primario' | 'exito' | 'alerta' | 'neutro';

@Component({
  selector: 'app-boton-grande',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boton-grande.component.html',
  styleUrls: ['./boton-grande.component.css'],
})
export class BotonGrandeComponent {
  @Input() texto = '';
  @Input() icono = '';
  @Input() variante: VarianteBoton = 'primario';
  @Input() deshabilitado = false;
  @Input() ariaLabel = '';
  @Output() presionado = new EventEmitter<void>();

  onClick(): void {
    if (this.deshabilitado) return;
    this.presionado.emit();
  }
}
