<div class="flash-container">
  <app-mascota-guia [mensaje]="mensajeMascota" (escuchar)="repetirAudio()"></app-mascota-guia>

  <!-- Proximidad (Gestalt): chips de categoría agrupados y separados del área de juego -->
  <div class="flash-categorias" role="tablist" aria-label="Categorías de flashcards">
    <button
      *ngFor="let cat of categorias"
      type="button"
      role="tab"
      class="flash-chip"
      [class.flash-chip-activo]="categoriaActiva === cat.valor"
      [attr.aria-selected]="categoriaActiva === cat.valor"
      (click)="cargarCategoria(cat.valor)"
    >
      <span aria-hidden="true">{{ cat.icono }}</span> {{ cat.etiqueta }}
    </button>
  </div>

  <div class="flash-area" *ngIf="actual">
    <button type="button" class="flash-nav" aria-label="Tarjeta anterior" (click)="anterior()">⬅️</button>

    <app-tarjeta-flashcard
      [imagen]="actual.recurso.imagen"
      [texto]="actual.texto"
      [volteada]="volteada"
      (voltear)="voltear()"
    ></app-tarjeta-flashcard>

    <button type="button" class="flash-nav" aria-label="Siguiente tarjeta" (click)="siguiente()">➡️</button>
  </div>

  <p class="flash-contador" *ngIf="palabras.length">{{ indice + 1 }} / {{ palabras.length }}</p>
</div>
