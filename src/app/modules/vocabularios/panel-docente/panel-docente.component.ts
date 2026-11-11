<div class="juegos-tabs" role="tablist" aria-label="Elegir minijuego">
  <button
    type="button"
    role="tab"
    class="juegos-tab-btn"
    [class.juegos-tab-activo]="juegoActivo === 'encuentra-letra'"
    (click)="cambiarJuego('encuentra-letra')"
  >
    🔤 Encuentra la Letra
  </button>
  <button
    type="button"
    role="tab"
    class="juegos-tab-btn"
    [class.juegos-tab-activo]="juegoActivo === 'relaciona-imagen'"
    (click)="cambiarJuego('relaciona-imagen')"
  >
    🖼️ Relaciona la Imagen
  </button>
  <button
    type="button"
    role="tab"
    class="juegos-tab-btn"
    [class.juegos-tab-activo]="juegoActivo === 'completa-palabra'"
    (click)="cambiarJuego('completa-palabra')"
  >
    ✏️ Completa la Palabra
  </button>
</div>

<app-encuentra-letra *ngIf="juegoActivo === 'encuentra-letra'"></app-encuentra-letra>
<app-relaciona-imagen *ngIf="juegoActivo === 'relaciona-imagen'"></app-relaciona-imagen>
<app-completa-palabra *ngIf="juegoActivo === 'completa-palabra'"></app-completa-palabra>
