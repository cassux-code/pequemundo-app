<div class="juego-container">
  <app-mascota-guia [mensaje]="mascotaMensaje" (escuchar)="actual && reiniciar()"></app-mascota-guia>

  <!-- Flexibilidad y eficiencia (Nielsen #7): selector de nivel siempre visible -->
  <div class="juego-niveles" role="group" aria-label="Elegir nivel de dificultad">
    <button
      *ngFor="let n of niveles"
      type="button"
      class="juego-nivel-btn"
      [class.juego-nivel-activo]="nivel === n"
      (click)="cambiarNivel(n)"
    >
      Nivel {{ n }}
    </button>
  </div>

  <!-- Visibilidad del estado (Nielsen #1): barra con estrellas, no solo números -->
  <div class="juego-progreso" aria-label="Progreso">
    <span class="juego-progreso-texto">{{ puntaje }} / 10 ⭐</span>
    <div class="juego-progreso-barra">
      <div class="juego-progreso-relleno" [style.width.%]="(puntaje / 10) * 100"></div>
    </div>
  </div>

  <div *ngIf="!completado && actual" class="juego-tarjeta">
    <p class="juego-pregunta">¿Con qué letra empieza?</p>
    <span class="juego-imagen" aria-hidden="true">{{ actual.recurso.imagen }}</span>

    <div class="juego-opciones">
      <button
        *ngFor="let opcion of opciones"
        type="button"
        class="juego-opcion-btn"
        [attr.aria-label]="'Letra ' + opcion"
        (click)="elegir(opcion)"
      >
        {{ opcion.toUpperCase() }}
      </button>
    </div>

    <app-feedback-mensaje [tipo]="feedbackTipo" [mensaje]="feedbackMensaje"></app-feedback-mensaje>
  </div>

  <div *ngIf="completado" class="juego-exito">
    <div class="juego-exito-emoji">🏆</div>
    <h3>¡Completaste el juego!</h3>
    <p>Lograste {{ puntaje }}/10 aciertos en Nivel {{ nivel }}.</p>
    <button type="button" class="juego-reiniciar" (click)="reiniciar()">Jugar de Nuevo 🔄</button>
  </div>
</div>
