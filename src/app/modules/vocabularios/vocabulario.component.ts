import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenidosService } from './services/contenidos.service';
import { MascotaGuiaComponent } from './shared/mascota-guia/mascota-guia.component';
import { AbecedarioComponent } from './abecedario/abecedario.component';
import { FlashcardsComponent } from './flashcards/flashcards.component';
import { JuegosComponent } from './juegos/juegos.component';
import { PanelDocenteComponent } from './panel-docente/panel-docente.component';

type VocabTab = 'abecedario' | 'flashcards' | 'juegos' | 'docente';

const INTRO_VISTA_KEY = 'vocab_intro_vista_modulo';

@Component({
  selector: 'app-vocabulario',
  standalone: true,
  imports: [
    CommonModule,
    MascotaGuiaComponent,
    AbecedarioComponent,
    FlashcardsComponent,
    JuegosComponent,
    PanelDocenteComponent,
  ],
  templateUrl: './vocabulario.component.html',
  styleUrls: ['./vocabulario.component.css'],
})
export class VocabularioComponent {
  @Output() volver = new EventEmitter<void>();

  tabActiva: VocabTab = 'abecedario';
  modoDocente = false;
  reducirMovimiento = false;
  mensajeBienvenida = '';

  constructor(public contenidos: ContenidosService) {
    this.mostrarBienvenidaSiEsNueva();
  }

  private mostrarBienvenidaSiEsNueva(): void {
    try {
      if (!localStorage.getItem(INTRO_VISTA_KEY)) {
        this.mensajeBienvenida = '¡Hola! Soy Tucán, tu guía. Aquí aprenderás letras, palabras y jugaremos juntos.';
        localStorage.setItem(INTRO_VISTA_KEY, '1');
        this.contenidos.speak(this.mensajeBienvenida);
      }
    } catch {
      this.mensajeBienvenida = '¡Hola! Soy Tucán, tu guía de Vocabulario.';
    }
  }

  cambiarTab(tab: VocabTab): void {
    this.tabActiva = tab;
  }

  /**
   * Alterna el panel docente. El proyecto no expone todavía un sistema de
   * roles real (AuthService.rolUsuario no está conectado al login), por lo
   * que este control queda desacoplado como simple interruptor local y debe
   * reemplazarse por una verificación de rol real cuando exista.
   */
  toggleModoDocente(): void {
    this.modoDocente = !this.modoDocente;
    if (this.modoDocente) this.tabActiva = 'docente';
    else this.tabActiva = 'abecedario';
  }

  toggleReducirMovimiento(): void {
    this.reducirMovimiento = !this.reducirMovimiento;
  }

  cambiarVelocidadVoz(valor: string): void {
    this.contenidos.velocidadVoz = Number(valor);
  }

  repetirBienvenida(): void {
    this.contenidos.speak(this.mensajeBienvenida || 'Bienvenido al módulo de Vocabulario.');
  }

  onVolverMenu(): void {
    this.volver.emit();
  }
}
