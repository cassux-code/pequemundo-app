export type Nivel = 1 | 2 | 3;

export type Categoria = 'animales' | 'frutas' | 'colores' | 'familia' | 'cuerpo';

export interface RecursoMultimedia {
  /** Emoji o SVG propio usado como ilustración (sin personajes con copyright). */
  imagen: string;
  /** Ruta a archivo de audio real (mp3/ogg), si existiera. */
  audioUrl?: string;
  /** Texto para el respaldo de lectura en voz alta (Web Speech API). */
  textoAudio: string;
}

export interface Letra {
  id: string;
  mayuscula: string;
  minuscula: string;
  fonema: string;
  palabraEjemplo: string;
  recurso: RecursoMultimedia;
}

export interface Palabra {
  id: string;
  texto: string;
  categoria: Categoria;
  letraInicial: string;
  silabas: string[];
  nivel: Nivel;
  recurso: RecursoMultimedia;
}

export type TipoActividad =
  | 'abecedario'
  | 'flashcards'
  | 'encuentra-letra'
  | 'relaciona-imagen'
  | 'completa-palabra';

export interface IntentoLectoescritura {
  id: string;
  ninoId: string;
  actividad: TipoActividad;
  itemId: string;
  acierto: boolean;
  tiempoMs: number;
  nivel: Nivel;
  fecha: string;
}

export type CajaLeitner = 1 | 2 | 3;

export interface TarjetaLeitner {
  itemId: string;
  caja: CajaLeitner;
  ultimaRevision: string;
}

export type TipoFeedback = 'exito' | 'error' | 'pista' | '';
