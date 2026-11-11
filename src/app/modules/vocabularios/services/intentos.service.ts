import { Injectable } from '@angular/core';
import { CajaLeitner, IntentoLectoescritura, TarjetaLeitner, TipoActividad, Nivel } from '../types/vocabulario.types';

const INTENTOS_KEY = 'vocab_intentos';
const LEITNER_KEY = 'vocab_leitner';

/**
 * Registro de intentos + repetición espaciada tipo Leitner:
 * caja 1 = falló o es nuevo (reaparece seguido), caja 3 = dominado (reaparece poco).
 */
@Injectable({ providedIn: 'root' })
export class IntentosService {
  private intentos: IntentoLectoescritura[] = this.leer<IntentoLectoescritura[]>(INTENTOS_KEY, []);
  private leitner: Record<string, TarjetaLeitner> = this.leer<Record<string, TarjetaLeitner>>(LEITNER_KEY, {});

  private leer<T>(key: string, porDefecto: T): T {
    try {
      const valor = localStorage.getItem(key);
      return valor ? (JSON.parse(valor) as T) : porDefecto;
    } catch {
      return porDefecto;
    }
  }

  private guardar(): void {
    try {
      localStorage.setItem(INTENTOS_KEY, JSON.stringify(this.intentos));
      localStorage.setItem(LEITNER_KEY, JSON.stringify(this.leitner));
    } catch {
      // sin almacenamiento disponible: la sesión sigue funcionando solo en memoria
    }
  }

  // POST /api/intentos
  async registrarIntento(datos: Omit<IntentoLectoescritura, 'id' | 'fecha'>): Promise<void> {
    const intento: IntentoLectoescritura = {
      ...datos,
      id: `${datos.itemId}-${Date.now()}`,
      fecha: new Date().toISOString(),
    };
    this.intentos = [...this.intentos, intento];
    this.actualizarCaja(datos.itemId, datos.acierto);
    this.guardar();
  }

  private actualizarCaja(itemId: string, acierto: boolean): void {
    const actual = this.leitner[itemId]?.caja ?? 1;
    const siguienteCaja: CajaLeitner = acierto
      ? (Math.min(actual + 1, 3) as CajaLeitner)
      : 1;
    this.leitner[itemId] = { itemId, caja: siguienteCaja, ultimaRevision: new Date().toISOString() };
  }

  getCaja(itemId: string): CajaLeitner {
    return this.leitner[itemId]?.caja ?? 1;
  }

  /** Peso de aparición: caja 1 aparece 3x más seguido que caja 3. */
  private pesoCaja(itemId: string): number {
    const caja = this.getCaja(itemId);
    return caja === 1 ? 3 : caja === 2 ? 2 : 1;
  }

  /** Construye una cola de ids priorizando los que están en cajas bajas (fallados/nuevos). */
  construirColaRepeticion<T extends { id: string }>(items: T[]): T[] {
    const pool: T[] = [];
    for (const item of items) {
      for (let i = 0; i < this.pesoCaja(item.id); i++) pool.push(item);
    }
    return pool.sort(() => Math.random() - 0.5);
  }

  contarFallosRecientes(itemId: string, actividad: TipoActividad): number {
    return this.intentos.filter((i) => i.itemId === itemId && i.actividad === actividad && !i.acierto).length;
  }

  siguienteNivel(actividad: TipoActividad, nivelActual: Nivel, aciertosParaSubir = 5): Nivel {
    const aciertosSeguidos = this.ultimosAciertosSeguidos(actividad);
    if (aciertosSeguidos >= aciertosParaSubir && nivelActual < 3) return (nivelActual + 1) as Nivel;
    return nivelActual;
  }

  private ultimosAciertosSeguidos(actividad: TipoActividad): number {
    const propios = this.intentos.filter((i) => i.actividad === actividad).slice(-10);
    let racha = 0;
    for (let i = propios.length - 1; i >= 0; i--) {
      if (propios[i].acierto) racha++;
      else break;
    }
    return racha;
  }
}
