import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mascota-guia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mascota-guia.component.html',
  styleUrls: ['./mascota-guia.component.css'],
})
export class MascotaGuiaComponent {
  @Input() mensaje = '';
  @Output() escuchar = new EventEmitter<void>();
}
