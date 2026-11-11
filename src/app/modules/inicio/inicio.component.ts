import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface ModuloCard {
  icono: string;
  titulo: string;
  descripcion: string;
  boton: string;
  ruta: string;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  auth = inject(AuthService);

  modulos: ModuloCard[] = [
    { icono: '📚', titulo: 'Módulo: Vocabulario', descripcion: 'Abecedario interactivo, tarjetas mágicas y minijuegos de palabras.', boton: '¡A Jugar!', ruta: '/vocabularios' },
    { icono: '🔢', titulo: 'Módulo: Matemáticas', descripcion: 'Minijuegos de conteo del 1 al 20, formas geométricas, patrones y sumas divertidas.', boton: '¡Explorar!', ruta: '/matematicas' },
    { icono: '🎨', titulo: 'Módulo: Arte y Sonidos', descripcion: 'Lienzo de dibujo digital mágico, xilófono y sonidos de animales.', boton: '¡Crear!', ruta: '/arte-sonido' },
    { icono: '📊', titulo: 'Módulo: Logros y Reportes', descripcion: 'Colección de insignias, estrellas acumuladas y reportes de progreso para papás.', boton: '¡Ver Avances!', ruta: '/logros-reportes' },
    { icono: '🛡️', titulo: 'Módulo: Perfiles y Roles', descripcion: 'Gestión de usuarios, roles (Padre, Maestro, Alumno) y control de sesiones seguras.', boton: 'Gestionar Acceso', ruta: '/perfiles-roles' }
  ];
}
