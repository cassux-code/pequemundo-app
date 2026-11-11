
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Modalidad de acceso
  modoAcceso = signal<'adulto' | 'alumno'>('adulto');

  // Datos para adultos
  correoInput = '';
  passwordInput = '';

  // PIN visual para alumnos
  opcionesPin = ['⭐', '🐱', '🌈', '⚽', '🐸', '🚀'];
  pinVisual = signal<string[]>([]);

  // Mensajes
  mensajeAlerta = signal('');
  tipoAlerta = signal<'success' | 'error' | ''>('');

  cambiarModo(modo: 'adulto' | 'alumno') {
    this.modoAcceso.set(modo);
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.correoInput = '';
    this.passwordInput = '';
    this.pinVisual.set([]);
    this.mensajeAlerta.set('');
    this.tipoAlerta.set('');
  }

  seleccionarImagen(imagen: string) {
    if (this.pinVisual().length < 4) {
      this.pinVisual.update(pin => [...pin, imagen]);
    }
  }

  quitarUltimaImagen() {
    this.pinVisual.update(pin => pin.slice(0, -1));
  }

  onLoginAdulto() {
    const exito = this.authService.loginAdulto(
      this.correoInput,
      this.passwordInput
    );

    if (exito) {
      this.accesoConcedido();
    } else {
      this.mostrarError('Correo o contraseña incorrectos.');
    }
  }

  onLoginAlumno() {
    const pin = this.pinVisual().join('');
    const exito = this.authService.loginAlumno(pin);

    if (exito) {
      this.accesoConcedido();
    } else {
      this.mostrarError('El PIN visual es incorrecto.');
    }
  }

  private accesoConcedido() {
    this.tipoAlerta.set('success');
    this.mensajeAlerta.set('¡Acceso concedido!');

    setTimeout(() => {
      this.router.navigate(['/inicio']);
    }, 800);
  }

  private mostrarError(mensaje: string) {
    this.tipoAlerta.set('error');
    this.mensajeAlerta.set(mensaje);
  }
}
