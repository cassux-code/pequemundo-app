import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenidosService } from '../services/contenidos.service';
import { MascotaGuiaComponent } from '../shared/mascota-guia/mascota-guia.component';
import { Letra } from '../types/vocabulario.types';

@Component({
  selector: 'app-abecedario',
  standalone: true,
  imports: [CommonModule, MascotaGuiaComponent],
  templateUrl: './abecedario.component.html',
  styleUrls: ['./abecedario.component.css'],
})
export class AbecedarioComponent implements OnInit {
  letras: Letra[] = [];
  letraActiva: Letra | null = null;
  mensajeMascota = 'Toca cualquier letra para escuchar su sonido y ver un ejemplo.';

  constructor(private contenidos: ContenidosService) {}

  async ngOnInit(): Promise<void> {
    this.letras = await this.contenidos.getLetras();
  }

  seleccionar(letra: Letra): void {
    this.letraActiva = letra;
    this.contenidos.speak(letra.recurso.textoAudio);
  }

  repetirAudio(): void {
    if (this.letraActiva) this.contenidos.speak(this.letraActiva.recurso.textoAudio);
    else this.contenidos.speak(this.mensajeMascota);
  }
}
