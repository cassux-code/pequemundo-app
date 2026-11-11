import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncuentraLetraComponent } from './encuentra-letra/encuentra-letra.component';
import { RelacionaImagenComponent } from './relaciona-imagen/relaciona-imagen.component';
import { CompletaPalabraComponent } from './completa-palabra/completa-palabra.component';

type JuegoTab = 'encuentra-letra' | 'relaciona-imagen' | 'completa-palabra';

@Component({
  selector: 'app-juegos',
  standalone: true,
  imports: [CommonModule, EncuentraLetraComponent, RelacionaImagenComponent, CompletaPalabraComponent],
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.css'],
})
export class JuegosComponent {
  juegoActivo: JuegoTab = 'encuentra-letra';

  cambiarJuego(juego: JuegoTab): void {
    this.juegoActivo = juego;
  }
}
