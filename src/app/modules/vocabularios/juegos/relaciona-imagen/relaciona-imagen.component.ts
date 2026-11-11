import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-relaciona-imagen',
  templateUrl: './relaciona-imagen.component.html',
  styleUrls: ['./relaciona-imagen.component.css']
})
export class RelacionaImagenComponent implements OnInit {
  niveles: number[] = [1, 2, 3];
  nivel: number = 1;
  puntaje: number = 0;
  completado: boolean = false;
  
  // Simulación del elemento actual y opciones
  actual: any = {
    recurso: { imagen: '🍎' }
  };
  opciones: string[] = ['a', 'e', 'i', 'o', 'u'];

  feedbackTipo: string = '';
  feedbackMensaje: string = '';
  mascotaMensaje: string = '¡Hola! Encuentra la letra correcta.';

  ngOnInit(): void {
    this.reiniciar();
  }

  cambiarNivel(n: number): void {
    this.nivel = n;
    this.reiniciar();
  }

  elegir(opcion: string): void {
    // Lógica cuando el usuario selecciona una opción
    if (opcion === 'a') {
      this.puntaje++;
      this.feedbackTipo = 'success';
      this.feedbackMensaje = '¡Correcto!';
    } else {
      this.feedbackTipo = 'error';
      this.feedbackMensaje = 'Inténtalo de nuevo.';
    }

    if (this.puntaje >= 10) {
      this.completado = true;
    }
  }

  reiniciar(): void {
    this.puntaje = 0;
    this.completado = false;
    this.feedbackTipo = '';
    this.feedbackMensaje = '';
  }
}