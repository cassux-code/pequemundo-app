import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenidosService } from '../services/contenidos.service';
import { ProgressEmitterService } from '../services/progress-emitter.service';
import { TarjetaFlashcardComponent } from '../shared/tarjeta-flashcard/tarjeta-flashcard.component';
import { MascotaGuiaComponent } from '../shared/mascota-guia/mascota-guia.component';
import { Categoria, Palabra } from '../types/vocabulario.types';

interface CategoriaOpcion {
  valor: Categoria;
  etiqueta: string;
  icono: string;
}

@Component({
  selector: 'app-flashcards',
  standalone: true,
  imports: [CommonModule, TarjetaFlashcardComponent, MascotaGuiaComponent],
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.css'],
})
export class FlashcardsComponent implements OnInit {
  categorias: CategoriaOpcion[] = [
    { valor: 'animales', etiqueta: 'Animales', icono: '🐶' },
    { valor: 'frutas', etiqueta: 'Frutas', icono: '🍎' },
    { valor: 'colores', etiqueta: 'Colores', icono: '🎨' },
    { valor: 'familia', etiqueta: 'Familia', icono: '👨‍👩‍👧' },
    { valor: 'cuerpo', etiqueta: 'Cuerpo', icono: '✋' },
  ];

  categoriaActiva: Categoria = 'animales';
  palabras: Palabra[] = [];
  indice = 0;
  volteada = false;
  mensajeMascota = 'Elige una categoría y toca la tarjeta para voltearla y escuchar la palabra.';

  constructor(
    private contenidos: ContenidosService,
    private progreso: ProgressEmitterService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarCategoria('animales');
  }

  async cargarCategoria(categoria: Categoria): Promise<void> {
    this.categoriaActiva = categoria;
    this.indice = 0;
    this.volteada = false;
    this.palabras = await this.contenidos.getPalabras({ categoria });
  }

  get actual(): Palabra | undefined {
    return this.palabras[this.indice];
  }

  voltear(): void {
    this.volteada = !this.volteada;
    if (this.volteada && this.actual) {
      this.contenidos.speak(this.actual.recurso.textoAudio);
      this.progreso.emitAcierto('flashcards', this.actual.id);
    }
  }

  siguiente(): void {
    if (this.indice < this.palabras.length - 1) this.indice++;
    else {
      this.indice = 0;
      this.progreso.emitActividadCompletada('flashcards', this.actual?.nivel ?? 1);
    }
    this.volteada = false;
  }

  anterior(): void {
    this.indice = this.indice > 0 ? this.indice - 1 : this.palabras.length - 1;
    this.volteada = false;
  }

  repetirAudio(): void {
    if (this.actual) this.contenidos.speak(this.actual.recurso.textoAudio);
    else this.contenidos.speak(this.mensajeMascota);
  }
}
