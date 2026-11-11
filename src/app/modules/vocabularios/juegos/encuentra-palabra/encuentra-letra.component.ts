import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenidosService } from '../../services/contenidos.service';
import { IntentosService } from '../../services/intentos.service';
import { ProgressEmitterService } from '../../services/progress-emitter.service';
import { FeedbackMensajeComponent } from '../../shared/feedback-mensaje/feedback-mensaje.component';
import { MascotaGuiaComponent } from '../../shared/mascota-guia/mascota-guia.component';
import { Nivel, Palabra, TipoFeedback } from '../../types/vocabulario.types';

const META_ACIERTOS = 10;
const INTRO_VISTA_KEY = 'vocab_intro_vista_encuentra-letra';

@Component({
  selector: 'app-encuentra-letra',
  standalone: true,
  imports: [CommonModule, FeedbackMensajeComponent, MascotaGuiaComponent],
  templateUrl: './encuentra-letra.component.html',
  styleUrls: ['./encuentra-letra.component.css'],
})
export class EncuentraLetraComponent implements OnInit {
  readonly niveles: Nivel[] = [1, 2, 3];
  nivel: Nivel = 1;
  cola: Palabra[] = [];
  actual: Palabra | null = null;
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
        this.mascotaMensaje = 'Mira la imagen y escucha la palabra. Luego toca la letra con la que empieza.';
        localStorage.setItem(INTRO_VISTA_KEY, '1');
        this.contenidos.speak(this.mascotaMensaje);
      }
    } catch {
      this.mascotaMensaje = 'Mira la imagen y toca la letra con la que empieza.';
    }
  }

  async cambiarNivel(nivel: Nivel): Promise<void> {
    this.nivel = nivel;
    this.puntaje = 0;
    this.completado = false;
    await this.generarRonda();
  }

  private async generarRonda(): Promise<void> {
    if (this.cola.length === 0) {
      const palabras = await this.contenidos.getPalabras({ nivel: this.nivel });
      this.cola = this.intentos.construirColaRepeticion(palabras);
    }
    this.actual = this.cola.shift() ?? null;
    this.fallosActuales = this.actual ? this.intentos.contarFallosRecientes(this.actual.id, 'encuentra-letra') : 0;
    this.feedbackTipo = '';
    this.feedbackMensaje = '';
    this.inicioMs = Date.now();
    if (this.actual) {
      this.opciones = this.generarOpciones(this.actual.letraInicial);
      this.contenidos.speak(this.actual.texto);
    }
  }

  /** Nivel 1: 2 opciones; nivel 2: 3; nivel 3: 4 opciones más parecidas entre sí. */
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
    const acierto = letra === this.actual.letraInicial;
    await this.intentos.registrarIntento({
      ninoId: 'ninoActivo',
      actividad: 'encuentra-letra',
      itemId: this.actual.id,
      acierto,
      tiempoMs: Date.now() - this.inicioMs,
      nivel: this.nivel,
    });
    this.progreso.emitAcierto('encuentra-letra', this.actual.id);

    if (acierto) {
      this.puntaje++;
      this.feedbackTipo = 'exito';
      this.feedbackMensaje = `¡Muy bien! (${this.puntaje}/${META_ACIERTOS}) ⭐`;
      this.contenidos.speak('¡Muy bien!');
      if (this.puntaje >= META_ACIERTOS) {
        this.completado = true;
        this.progreso.emitActividadCompletada('encuentra-letra', this.nivel);
        return;
      }
      await this.generarRonda();
    } else {
      this.fallosActuales++;
      if (this.fallosActuales >= 2) {
        this.feedbackTipo = 'pista';
        this.feedbackMensaje = `💡 Pista: empieza como "${this.actual.letraInicial.toUpperCase()}...". ¡Inténtalo otra vez!`;
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
