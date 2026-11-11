import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenidosService } from '../../services/contenidos.service';
import { IntentosService } from '../../services/intentos.service';
import { ProgressEmitterService } from '../../services/progress-emitter.service';
import { FeedbackMensajeComponent } from '../../shared/feedback-mensaje/feedback-mensaje.component';
import { MascotaGuiaComponent } from '../../shared/mascota-guia/mascota-guia.component';
import { Nivel, Palabra, TipoFeedback } from '../../types/vocabulario.types';

const META_ACIERTOS = 10;
const INTRO_VISTA_KEY = 'vocab_intro_vista_completa-palabra';

@Component({
  selector: 'app-completa-palabra',
  standalone: true,
  imports: [CommonModule, FeedbackMensajeComponent, MascotaGuiaComponent],
  templateUrl: './completa-palabra.component.html',
  styleUrls: ['./completa-palabra.component.css'],
})
export class CompletaPalabraComponent implements OnInit {
  readonly niveles: Nivel[] = [1, 2, 3];
  nivel: Nivel = 1;
  cola: Palabra[] = [];
  actual: Palabra | null = null;
  palabraVisible = '';
  letraFaltante = '';
  posicionFaltante = 0;
  opciones: string[] = [];
  puntaje = 0;
  completado = false;
  feedbackTipo: TipoFeedback = '';
  feedbackMensaje = '';
  fallosActuales = 0;
  mascotaMensaje = '';
  private inicioMs = 0;

  constructor(
    private contenidos: ContenidosService,
    private intentos: IntentosService,
    private progreso: ProgressEmitterService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.mostrarIntroSiEsNueva();
    await this.generarRonda();
  }

  private mostrarIntroSiEsNueva(): void {
    try {
      if (!localStorage.getItem(INTRO_VISTA_KEY)) {
        this.mascotaMensaje = 'A la palabra le falta una letra. Elige la letra correcta para completarla.';
        localStorage.setItem(INTRO_VISTA_KEY, '1');
        this.contenidos.speak(this.mascotaMensaje);
      }
    } catch {
      this.mascotaMensaje = 'Elige la letra que falta en la palabra.';
    }
  }

  async cambiarNivel(nivel: Nivel): Promise<void> {
    this.nivel = nivel;
    this.puntaje = 0;
    this.completado = false;
    this.cola = [];
    await this.generarRonda();
  }

  private async generarRonda(): Promise<void> {
    if (this.cola.length === 0) {
      const palabras = await this.contenidos.getPalabras({ nivel: this.nivel });
      this.cola = this.intentos.construirColaRepeticion(palabras.filter((p) => p.texto.length > 1));
    }
    this.actual = this.cola.shift() ?? null;
    this.fallosActuales = this.actual ? this.intentos.contarFallosRecientes(this.actual.id, 'completa-palabra') : 0;
    this.feedbackTipo = '';
    this.feedbackMensaje = '';
    this.inicioMs = Date.now();
    if (this.actual) {
      this.prepararMascara(this.actual.texto);
      this.opciones = this.generarOpciones(this.letraFaltante);
    }
  }

  private prepararMascara(texto: string): void {
    this.posicionFaltante = Math.floor(Math.random() * texto.length);
    this.letraFaltante = texto[this.posicionFaltante].toLowerCase();
    this.palabraVisible = texto
      .split('')
      .map((letra, i) => (i === this.posicionFaltante ? '_' : letra))
      .join('');
  }

  private generarOpciones(correcta: string): string[] {
    const alfabeto = 'abcdefghijklmnñopqrstuvwxyz'.split('');
    const cantidad = this.nivel === 1 ? 2 : this.nivel === 2 ? 3 : 4;
    const set = new Set<string>([correcta]);
    while (set.size < cantidad) {
      set.add(alfabeto[Math.floor(Math.random() * alfabeto.length)]);
    }
    return Array.from(set).sort(() => Math.random() - 0.5);
  }

  async elegir(letra: string): Promise<void> {
    if (!this.actual || this.completado) return;
    const acierto = letra === this.letraFaltante;
    await this.intentos.registrarIntento({
      ninoId: 'ninoActivo',
      actividad: 'completa-palabra',
      itemId: this.actual.id,
      acierto,
      tiempoMs: Date.now() - this.inicioMs,
      nivel: this.nivel,
    });
    this.progreso.emitAcierto('completa-palabra', this.actual.id);

    if (acierto) {
      this.puntaje++;
      this.feedbackTipo = 'exito';
      this.feedbackMensaje = `¡Muy bien! (${this.puntaje}/${META_ACIERTOS}) ⭐`;
      this.contenidos.speak('¡Muy bien! ' + this.actual.texto);
      if (this.puntaje >= META_ACIERTOS) {
        this.completado = true;
        this.progreso.emitActividadCompletada('completa-palabra', this.nivel);
        return;
      }
      await this.generarRonda();
    } else {
      this.fallosActuales++;
      if (this.fallosActuales >= 2) {
        this.feedbackTipo = 'pista';
        this.feedbackMensaje = `💡 Pista: la letra suena como "${this.letraFaltante.toUpperCase()}". ¡Inténtalo otra vez!`;
      } else {
        this.feedbackTipo = 'error';
        this.feedbackMensaje = '¡Casi! Inténtalo otra vez.';
      }
      this.contenidos.speak('Inténtalo otra vez.');
    }
  }

  reiniciar(): void {
    this.puntaje = 0;
    this.completado = false;
    this.cola = [];
    this.generarRonda();
  }
}
