import { Injectable, computed, signal } from '@angular/core';

// ===== Modelos del Módulo 5 (Logros y Reportes) =====
export type ModuloJuego = 'Vocabulario' | 'Matemáticas' | 'Arte y Sonidos';

export interface RegistroActividad {
  modulo: ModuloJuego;
  actividad: string;
  fecha: string;      // ISO yyyy-mm-dd
  aciertos: number;
  intentos: number;
  minutos: number;
  estrellas: number;
}

export interface Insignia {
  id: string;
  icono: string;
  nombre: string;
  descripcion: string;
  meta: number;                 // valor necesario para desbloquear
  tipo: 'estrellas' | 'minutos' | 'precision' | 'actividades' | 'modulos';
}

export interface InsigniaEstado extends Insignia {
  actual: number;
  desbloqueada: boolean;
  porcentaje: number;           // 0-100
}

export interface ResumenModulo {
  modulo: ModuloJuego;
  icono: string;
  aciertos: number;
  intentos: number;
  precision: number;
  minutos: number;
  estrellas: number;
}

const CLAVE_STORAGE = 'pequemundo_progreso';

function haceDias(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

@Injectable({ providedIn: 'root' })
export class ProgresoService {

  // Datos de ejemplo para la demostración (variable pública, igual que usuariosValidos en AuthService)
  public registrosIniciales: RegistroActividad[] = [
    { modulo: 'Vocabulario',    actividad: 'Abecedario interactivo', fecha: haceDias(6), aciertos: 9,  intentos: 10, minutos: 12, estrellas: 9 },
    { modulo: 'Matemáticas',    actividad: 'Sumas con manzanas',     fecha: haceDias(5), aciertos: 8,  intentos: 10, minutos: 10, estrellas: 8 },
    { modulo: 'Arte y Sonidos', actividad: 'Xilófono mágico',        fecha: haceDias(5), aciertos: 6,  intentos: 6,  minutos: 15, estrellas: 6 },
    { modulo: 'Vocabulario',    actividad: 'Flashcards',             fecha: haceDias(4), aciertos: 7,  intentos: 9,  minutos: 9,  estrellas: 7 },
    { modulo: 'Matemáticas',    actividad: 'Conteo con estrellas',   fecha: haceDias(3), aciertos: 10, intentos: 12, minutos: 11, estrellas: 10 },
    { modulo: 'Vocabulario',    actividad: 'Arrastrar y soltar',     fecha: haceDias(2), aciertos: 8,  intentos: 11, minutos: 14, estrellas: 8 },
    { modulo: 'Matemáticas',    actividad: 'Formas geométricas',     fecha: haceDias(1), aciertos: 9,  intentos: 10, minutos: 13, estrellas: 9 },
    { modulo: 'Arte y Sonidos', actividad: 'Lienzo de dibujo',       fecha: haceDias(0), aciertos: 5,  intentos: 5,  minutos: 20, estrellas: 5 }
  ];

  // Catálogo de insignias
  public catalogoInsignias: Insignia[] = [
    { id: 'primera-estrella', icono: '⭐', nombre: 'Primera Estrella',   descripcion: 'Consigue tu primera estrella.',          meta: 1,   tipo: 'estrellas' },
    { id: 'coleccionista',    icono: '🌟', nombre: 'Coleccionista',      descripcion: 'Acumula 25 estrellas.',                  meta: 25,  tipo: 'estrellas' },
    { id: 'super-estrella',   icono: '🏆', nombre: 'Súper Estrella',     descripcion: 'Acumula 100 estrellas.',                 meta: 100, tipo: 'estrellas' },
    { id: 'explorador',       icono: '🧭', nombre: 'Explorador',         descripcion: 'Juega en los 3 módulos de actividades.', meta: 3,   tipo: 'modulos' },
    { id: 'constante',        icono: '🔥', nombre: 'Constante',          descripcion: 'Completa 5 actividades.',                meta: 5,   tipo: 'actividades' },
    { id: 'campeon',          icono: '🥇', nombre: 'Campeón',            descripcion: 'Completa 20 actividades.',               meta: 20,  tipo: 'actividades' },
    { id: 'tiempo-de-juego',  icono: '⏰', nombre: 'Gran Jugador',       descripcion: 'Juega durante 60 minutos.',              meta: 60,  tipo: 'minutos' },
    { id: 'puntería',         icono: '🎯', nombre: 'Puntería Perfecta',  descripcion: 'Alcanza 90% de precisión.',              meta: 90,  tipo: 'precision' }
  ];

  private _registros = signal<RegistroActividad[]>(this.cargar());
  public readonly registros = this._registros.asReadonly();

  // ===== Métricas globales =====
  public readonly estrellas = computed(() => this._registros().reduce((s, r) => s + r.estrellas, 0));
  public readonly minutos = computed(() => this._registros().reduce((s, r) => s + r.minutos, 0));
  public readonly aciertos = computed(() => this._registros().reduce((s, r) => s + r.aciertos, 0));
  public readonly intentos = computed(() => this._registros().reduce((s, r) => s + r.intentos, 0));
  public readonly actividades = computed(() => this._registros().length);
  public readonly precision = computed(() =>
    this.intentos() === 0 ? 0 : Math.round((this.aciertos() / this.intentos()) * 100)
  );

  public readonly resumenModulos = computed<ResumenModulo[]>(() => {
    const iconos: Record<ModuloJuego, string> = { 'Vocabulario': '📚', 'Matemáticas': '🔢', 'Arte y Sonidos': '🎨' };
    return (Object.keys(iconos) as ModuloJuego[]).map(modulo => {
      const rs = this._registros().filter(r => r.modulo === modulo);
      const aciertos = rs.reduce((s, r) => s + r.aciertos, 0);
      const intentos = rs.reduce((s, r) => s + r.intentos, 0);
      return {
        modulo,
        icono: iconos[modulo],
        aciertos,
        intentos,
        precision: intentos === 0 ? 0 : Math.round((aciertos / intentos) * 100),
        minutos: rs.reduce((s, r) => s + r.minutos, 0),
        estrellas: rs.reduce((s, r) => s + r.estrellas, 0)
      };
    });
  });

  // Minutos de juego de los últimos 7 días (para el gráfico semanal)
  public readonly minutosSemana = computed(() => {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return Array.from({ length: 7 }, (_, i) => {
      const fecha = haceDias(6 - i);
      const etiqueta = dias[new Date(fecha + 'T12:00:00').getDay()];
      const minutos = this._registros().filter(r => r.fecha === fecha).reduce((s, r) => s + r.minutos, 0);
      return { fecha, etiqueta, minutos };
    });
  });

  // ===== Insignias =====
  public readonly insignias = computed<InsigniaEstado[]>(() => {
    const modulosJugados = new Set(this._registros().map(r => r.modulo)).size;
    const valores = {
      estrellas: this.estrellas(),
      minutos: this.minutos(),
      precision: this.precision(),
      actividades: this.actividades(),
      modulos: modulosJugados
    };
    return this.catalogoInsignias.map(i => {
      const actual = valores[i.tipo];
      return {
        ...i,
        actual,
        desbloqueada: actual >= i.meta,
        porcentaje: Math.min(100, Math.round((actual / i.meta) * 100))
      };
    });
  });

  public readonly desbloqueadas = computed(() => this.insignias().filter(i => i.desbloqueada).length);

  // ===== API para que los demás módulos reporten su avance =====
  registrarActividad(r: RegistroActividad): void {
    this._registros.update(lista => [...lista, r]);
    this.guardar();
  }

  reiniciarDemo(): void {
    this._registros.set([...this.registrosIniciales]);
    this.guardar();
  }

  formatearTiempo(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h} h ${m} min` : `${m} min`;
  }

  private cargar(): RegistroActividad[] {
    try {
      const raw = localStorage.getItem(CLAVE_STORAGE);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [...this.registrosIniciales];
  }

  private guardar(): void {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(this._registros()));
    } catch {}
  }
}
