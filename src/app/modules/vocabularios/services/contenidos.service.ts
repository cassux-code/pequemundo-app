import { Injectable } from '@angular/core';
import { LETRAS } from '../data/letras.data';
import { PALABRAS } from '../data/palabras.data';
import { Categoria, Letra, Nivel, Palabra } from '../types/vocabulario.types';

const STORAGE_KEY = 'vocab_palabras_docente';

/**
 * Servicio abstracto de contenidos. Hoy lee datos mock + overrides del panel
 * docente en localStorage; cuando exista backend, solo este archivo cambia
 * (sustituir los cuerpos por llamadas HTTP a los endpoints comentados abajo).
 */
@Injectable({ providedIn: 'root' })
export class ContenidosService {
  /** Preferencia de velocidad de voz ajustable desde el módulo (Nielsen #7: flexibilidad). */
  velocidadVoz = 0.95;

  private palabras: Palabra[] = this.cargarPalabras();

  private cargarPalabras(): Palabra[] {
    try {
      const guardadas = localStorage.getItem(STORAGE_KEY);
      return guardadas ? (JSON.parse(guardadas) as Palabra[]) : [...PALABRAS];
    } catch {
      return [...PALABRAS];
    }
  }

  private guardarPalabras(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.palabras));
    } catch {
      // almacenamiento no disponible (modo privado); se continúa solo en memoria
    }
  }

  // GET /api/letras
  async getLetras(): Promise<Letra[]> {
    return LETRAS;
  }

  // GET /api/palabras?categoria=&nivel=
  async getPalabras(filtro?: { categoria?: Categoria; nivel?: Nivel }): Promise<Palabra[]> {
    return this.palabras.filter(
      (p) =>
        (!filtro?.categoria || p.categoria === filtro.categoria) &&
        (!filtro?.nivel || p.nivel === filtro.nivel),
    );
  }

  // POST /api/palabras
  async crearPalabra(datos: Omit<Palabra, 'id'>): Promise<Palabra> {
    const nueva: Palabra = { ...datos, id: `${datos.texto.toLowerCase()}-${Date.now()}` };
    this.palabras = [...this.palabras, nueva];
    this.guardarPalabras();
    return nueva;
  }

  // PUT /api/palabras/:id
  async actualizarPalabra(id: string, cambios: Partial<Palabra>): Promise<void> {
    this.palabras = this.palabras.map((p) => (p.id === id ? { ...p, ...cambios } : p));
    this.guardarPalabras();
  }

  // DELETE /api/palabras/:id
  async eliminarPalabra(id: string): Promise<void> {
    this.palabras = this.palabras.filter((p) => p.id !== id);
    this.guardarPalabras();
  }

  /** Lectura en voz alta con Web Speech API (es-ES), respaldo cuando no hay audio real. */
  speak(texto: string, velocidad?: number): void {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-ES';
    utterance.rate = velocidad ?? this.velocidadVoz;
    utterance.pitch = 1.15;
    window.speechSynthesis.speak(utterance);
  }
}
