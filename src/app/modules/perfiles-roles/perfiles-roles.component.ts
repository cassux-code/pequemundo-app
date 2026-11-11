import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// BOSQUEJO: el integrante responsable desarrolla aquí el módulo.
@Component({
  selector: 'app-perfiles-roles',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="modulo">
      <div class="icono">🛡️</div>
      <h2>Módulo: Perfiles y Roles</h2>
      <p>Gestión de usuarios, roles (Padre, Maestro, Alumno) y control de sesiones seguras.</p>
      <span class="badge">En construcción</span>
      <a routerLink="/inicio" class="volver">← Volver al inicio</a>
    </section>
  `,
  styles: [`
    .modulo { max-width: 600px; margin: 3rem auto; background: #fff; padding: 2.5rem; border-radius: 20px; text-align: center; box-shadow: 0 20px 30px rgba(2,132,199,.08); }
    .icono { font-size: 3rem; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: .3rem .8rem; border-radius: 999px; font-weight: 600; font-size: .85rem; }
    .volver { display: block; margin-top: 1.5rem; color: #0284c7; text-decoration: none; font-weight: 600; }
  `]
})
export class PerfilesRolesComponent {}
