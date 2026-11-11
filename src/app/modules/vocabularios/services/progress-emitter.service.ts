import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Nivel, TipoActividad } from '../types/vocabulario.types';

export type EventoProgreso =
  | { tipo: 'actividad_completada'; actividad: TipoActividad; nivel: Nivel }
  | { tipo: 'acierto'; actividad: TipoActividad; itemId: string }
  | { tipo: 'tiempo_sesion'; actividad: TipoActividad; tiempoMs: number };

/**
 * Stub desacoplado para el puente con el Módulo 5 (Progreso).
 * Si el proyecto define luego un bus/servicio de progreso compartido, basta
 * con hacer que este servicio delegue en él: los componentes de este módulo
 * no necesitan cambiar, solo siguen llamando a estos tres métodos.
 */
@Injectable({ providedIn: 'root' })
export class ProgressEmitterService {
  private readonly eventos$ = new Subject<EventoProgreso>();
  readonly eventos = this.eventos$.asObservable();

  emitActividadCompletada(actividad: TipoActividad, nivel: Nivel): void {
    this.eventos$.next({ tipo: 'actividad_completada', actividad, nivel });
  }

  emitAcierto(actividad: TipoActividad, itemId: string): void {
    this.eventos$.next({ tipo: 'acierto', actividad, itemId });
  }

  emitTiempoSesion(actividad: TipoActividad, tiempoMs: number): void {
    this.eventos$.next({ tipo: 'tiempo_sesion', actividad, tiempoMs });
  }
}
