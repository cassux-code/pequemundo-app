<div class="juego-container">
  <app-mascota-guia [mensaje]="mascotaMensaje" (escuchar)="actual && reiniciar()"></app-mascota-guia>

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

  <div class="juego-progreso" aria-label="Progreso">
    <span class="juego-progreso-texto">{{ puntaje }} / 10 ⭐</span>
    <div class="juego-progreso-barra">
      <div class="juego-progreso-relleno" [style.width.%]="(puntaje / 10) * 100"></div>
    </div>
  </div>

  <div *ngIf="!completado && actual" class="juego-tarjeta">
    <p class="juego-pregunta">¿Qué palabra corresponde a esta imagen?</p>
    <span class="juego-imagen" aria-hidden="true">{{ actual.recurso.imagen }}</span>

    <div class="juego-opciones">
      <button
        *ngFor="let opcion of opciones"
        type="button"
        class="juego-opcion-btn juego-opcion-palabra"
        (click)="elegir(opcion)"
      >
        {{ opcion.texto }}
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
