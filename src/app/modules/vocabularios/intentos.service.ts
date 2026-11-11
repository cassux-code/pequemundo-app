import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenidosService } from '../../services/contenidos.service';
import { IntentosService } from '../../services/intentos.service';
import { ProgressEmitterService } from '../../services/progress-emitter.service';
import { FeedbackMensajeComponent } from '../../shared/feedback-mensaje/feedback-mensaje.component';
import { MascotaGuiaComponent } from '../../shared/mascota-guia/mascota-guia.component';
import { Nivel, Palabra, TipoFeedback } from '../../types/vocabulario.types';

const META_ACIERTOS = 10;
const INTRO_VISTA_KEY = 'vocab_intro_vista_relaciona-imagen';

@Component({
  selector: 'app-relaciona-imagen',
  standalone: true,
  imports: [CommonModule, FeedbackMensajeComponent, MascotaGuiaComponent],
  templateUrl: './relaciona-imagen.component.html',
  styleUrls: ['./relaciona-imagen.component.css'],
})
export class RelacionaImagenComponent implements OnInit {
  readonly niveles: Nivel[] = [1, 2, 3];
  nivel: Nivel = 1;
  cola: Palabra[] = [];
  actual: Palabra | null = null;
  opciones: Palabra[] = [];
  puntaje = 0;
  completado = false;
  feedbackTipo: TipoFeedback = '';
  feedbackMensaje = '';
  fallosActuales = 0;
  mascotaMensaje = '';
  private inicioMs = 0;
  private todasLasPalabras: Palabra[] = [];

  constructor(
    private contenidos: ContenidosService,
    private intentos: IntentosService,
    private progreso: ProgressEmitterService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.mostrarIntroSiEsNueva();
    this.todasLasPalabras = await this.contenidos.getPalabras();
    await this.generarRonda();
  }

  private mostrarIntroSiEsNueva(): void {
    try {
      if (!localStorage.getItem(INTRO_VISTA_KEY)) {
        this.mascotaMensaje = 'Mira la imagen y toca la palabra que corresponde.';
        localStorage.setItem(INTRO_VISTA_KEY, '1');
        this.contenidos.speak(this.mascotaMensaje);
      }
    } catch {
      this.mascotaMensaje = 'Mira la imagen y toca la palabra correcta.';
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
      this.cola = this.intentos.construirColaRepeticion(palabras);
    }
    this.actual = this.cola.shift() ?? null;
    this.fallosActuales = this.actual ? this.intentos.contarFallosRecientes(this.actual.id, 'relaciona-imagen') : 0;
    this.feedbackTipo = '';
    this.feedbackMensaje = '';
    this.inicioMs = Date.now();
    if (this.actual) {
      this.opciones = this.generarOpciones(this.actual);
    }
  }

  private generarOpciones(correcta: Palabra): Palabra[] {
    const cantidad = this.nivel === 1 ? 2 : this.nivel === 2 ? 3 : 4;
    const distractoras = this.todasLasPalabras.filter((p) => p.id !== correcta.id);
    const elegidas = new Set<Palabra>([correcta]);
    while (elegidas.size < cantidad && elegidas.size < distractoras.length + 1) {
      elegidas.add(distractoras[Math.floor(Math.random() * distractoras.length)]);
    }
    return Array.from(elegidas).sort(() => Math.random() - 0.5);
  }

  async elegir(palabra: Palabra): Promise<void> {
    if (!this.actual || this.completado) return;
    const acierto = palabra.id === this.actual.id;
    await this.intentos.registrarIntento({
      ninoId: 'ninoActivo',
      actividad: 'relaciona-imagen',
      itemId: this.actual.id,
      acierto,
      tiempoMs: Date.now() - this.inicioMs,
      nivel: this.nivel,
    });
    this.progreso.emitAcierto('relaciona-imagen', this.actual.id);

    if (acierto) {
      this.puntaje++;
      this.feedbackTipo = 'exito';
      this.feedbackMensaje = `¡Muy bien! (${this.puntaje}/${META_ACIERTOS}) ⭐`;
      this.contenidos.speak('¡Muy bien!');
      if (this.puntaje >= META_ACIERTOS) {
        this.completado = true;
        this.progreso.emitActividadCompletada('relaciona-imagen', this.nivel);
        return;
      }
      await this.generarRonda();
    } else {
      this.fallosActuales++;
      if (this.fallosActuales >= 2) {
        this.feedbackTipo = 'pista';
        this.feedbackMensaje = `💡 Pista: empieza con "${this.actual.letraInicial.toUpperCase()}". ¡Inténtalo otra vez!`;
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
