
import { Injectable, signal } from '@angular/core';

export type RolUsuario = 'padre' | 'maestro' | 'alumno';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Credenciales de prueba para adultos
  public usuariosValidos = [
    {
      correo: 'padre@edukids.com',
      clave: '123456',
      nombre: 'Carlos Pérez',
      rol: 'padre' as RolUsuario
    },
    {
      correo: 'maestro@edukids.com',
      clave: '123456',
      nombre: 'María González',
      rol: 'maestro' as RolUsuario
    }
  ];

  // PIN de prueba para alumnos
  public pinAlumno = '⭐🐱🌈⚽';

  // Estado global de autenticación
  private _autenticado = signal(false);
  private _nombre = signal('');
  private _rol = signal<RolUsuario | null>(null);

  public readonly autenticado = this._autenticado.asReadonly();
  public readonly nombreUsuario = this._nombre.asReadonly();
  public readonly rolUsuario = this._rol.asReadonly();

  constructor() {
    try {
      const sesion = sessionStorage.getItem('edukids_sesion');

      if (sesion) {
        const datos = JSON.parse(sesion);

        this._autenticado.set(true);
        this._nombre.set(datos.nombre);
        this._rol.set(datos.rol);
      }
    } catch {
      this.logout();
    }
  }

  // Inicio de sesión para padres y maestros
  loginAdulto(correo: string, clave: string): boolean {

    const usuario = this.usuariosValidos.find(
      u => u.correo === correo.trim().toLowerCase()
        && u.clave === clave
    );

    if (!usuario) return false;

    this.iniciarSesion(usuario.nombre, usuario.rol);
    return true;
  }

  // Inicio de sesión para alumnos mediante PIN
  loginAlumno(pin: string): boolean {

    if (pin !== this.pinAlumno) return false;

    this.iniciarSesion('Alumno', 'alumno');
    return true;
  }

  private iniciarSesion(nombre: string, rol: RolUsuario): void {
    this._autenticado.set(true);
    this._nombre.set(nombre);
    this._rol.set(rol);

    try {
      sessionStorage.setItem('edukids_sesion', JSON.stringify({
        nombre,
        rol
      }));
    } catch {}
  }

  logout(): void {
    this._autenticado.set(false);
    this._nombre.set('');
    this._rol.set(null);

    try {
      sessionStorage.removeItem('edukids_sesion');
    } catch {}
  }

  isLoggedIn(): boolean {
    return this._autenticado();
  }

  tieneRol(rol: RolUsuario): boolean {
    return this._rol() === rol;
  }
}
