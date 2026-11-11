import { Palabra } from '../types/vocabulario.types';

function palabra(
  texto: string,
  categoria: Palabra['categoria'],
  silabas: string[],
  nivel: Palabra['nivel'],
  imagen: string,
): Palabra {
  return {
    id: texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''),
    texto,
    categoria,
    letraInicial: texto[0].toLowerCase(),
    silabas,
    nivel,
    recurso: { imagen, textoAudio: texto },
  };
}

export const PALABRAS: Palabra[] = [
  // Animales
  palabra('GATO', 'animales', ['GA', 'TO'], 1, '🐱'),
  palabra('PERRO', 'animales', ['PE', 'RRO'], 1, '🐶'),
  palabra('PATO', 'animales', ['PA', 'TO'], 1, '🦆'),
  palabra('OSO', 'animales', ['O', 'SO'], 1, '🐻'),
  palabra('VACA', 'animales', ['VA', 'CA'], 1, '🐄'),
  palabra('CONEJO', 'animales', ['CO', 'NE', 'JO'], 2, '🐰'),
  palabra('LEÓN', 'animales', ['LE', 'ÓN'], 2, '🦁'),
  palabra('TIGRE', 'animales', ['TI', 'GRE'], 2, '🐯'),
  palabra('JIRAFA', 'animales', ['JI', 'RA', 'FA'], 2, '🦒'),
  palabra('ELEFANTE', 'animales', ['E', 'LE', 'FAN', 'TE'], 3, '🐘'),
  palabra('MARIPOSA', 'animales', ['MA', 'RI', 'PO', 'SA'], 3, '🦋'),
  palabra('TORTUGA', 'animales', ['TOR', 'TU', 'GA'], 3, '🐢'),

  // Frutas
  palabra('UVA', 'frutas', ['U', 'VA'], 1, '🍇'),
  palabra('PIÑA', 'frutas', ['PI', 'ÑA'], 1, '🍍'),
  palabra('PERA', 'frutas', ['PE', 'RA'], 1, '🍐'),
  palabra('KIWI', 'frutas', ['KI', 'WI'], 1, '🥝'),
  palabra('COCO', 'frutas', ['CO', 'CO'], 1, '🥥'),
  palabra('MANZANA', 'frutas', ['MAN', 'ZA', 'NA'], 2, '🍎'),
  palabra('SANDÍA', 'frutas', ['SAN', 'DÍ', 'A'], 2, '🍉'),
  palabra('FRESA', 'frutas', ['FRE', 'SA'], 2, '🍓'),
  palabra('LIMÓN', 'frutas', ['LI', 'MÓN'], 2, '🍋'),
  palabra('NARANJA', 'frutas', ['NA', 'RAN', 'JA'], 2, '🍊'),
  palabra('DURAZNO', 'frutas', ['DU', 'RAZ', 'NO'], 3, '🍑'),
  palabra('PLÁTANO', 'frutas', ['PLÁ', 'TA', 'NO'], 3, '🍌'),

  // Colores
  palabra('ROJO', 'colores', ['RO', 'JO'], 1, '🔴'),
  palabra('AZUL', 'colores', ['A', 'ZUL'], 1, '🔵'),
  palabra('VERDE', 'colores', ['VER', 'DE'], 1, '🟢'),
  palabra('CAFÉ', 'colores', ['CA', 'FÉ'], 1, '🟤'),
  palabra('NEGRO', 'colores', ['NE', 'GRO'], 1, '⚫'),
  palabra('BLANCO', 'colores', ['BLAN', 'CO'], 1, '⚪'),
  palabra('GRIS', 'colores', ['GRIS'], 1, '⚫'),
  palabra('MORADO', 'colores', ['MO', 'RA', 'DO'], 2, '🟣'),
  palabra('ROSADO', 'colores', ['RO', 'SA', 'DO'], 2, '🌸'),
  palabra('CELESTE', 'colores', ['CE', 'LES', 'TE'], 2, '🔵'),
  palabra('AMARILLO', 'colores', ['A', 'MA', 'RI', 'LLO'], 3, '🟡'),
  palabra('VIOLETA', 'colores', ['VIO', 'LE', 'TA'], 3, '🟣'),

  // Familia
  palabra('MAMÁ', 'familia', ['MA', 'MÁ'], 1, '👩'),
  palabra('PAPÁ', 'familia', ['PA', 'PÁ'], 1, '👨'),
  palabra('BEBÉ', 'familia', ['BE', 'BÉ'], 1, '👶'),
  palabra('TÍO', 'familia', ['TÍ', 'O'], 1, '👨‍🦱'),
  palabra('TÍA', 'familia', ['TÍ', 'A'], 1, '👩‍🦱'),
  palabra('HERMANO', 'familia', ['HER', 'MA', 'NO'], 2, '👦'),
  palabra('HERMANA', 'familia', ['HER', 'MA', 'NA'], 2, '👧'),
  palabra('ABUELO', 'familia', ['A', 'BUE', 'LO'], 2, '👴'),
  palabra('ABUELA', 'familia', ['A', 'BUE', 'LA'], 2, '👵'),
  palabra('PRIMO', 'familia', ['PRI', 'MO'], 2, '🧒'),
  palabra('PRIMA', 'familia', ['PRI', 'MA'], 2, '🧒'),
  palabra('FAMILIA', 'familia', ['FA', 'MI', 'LIA'], 3, '👨‍👩‍👧‍👦'),

  // Cuerpo
  palabra('OJO', 'cuerpo', ['O', 'JO'], 1, '👁️'),
  palabra('MANO', 'cuerpo', ['MA', 'NO'], 1, '✋'),
  palabra('PIE', 'cuerpo', ['PIE'], 1, '🦶'),
  palabra('BOCA', 'cuerpo', ['BO', 'CA'], 1, '👄'),
  palabra('DEDO', 'cuerpo', ['DE', 'DO'], 1, '☝️'),
  palabra('CODO', 'cuerpo', ['CO', 'DO'], 1, '💪'),
  palabra('NARIZ', 'cuerpo', ['NA', 'RIZ'], 2, '👃'),
  palabra('OREJA', 'cuerpo', ['O', 'RE', 'JA'], 2, '👂'),
  palabra('CABEZA', 'cuerpo', ['CA', 'BE', 'ZA'], 2, '🧑'),
  palabra('BRAZO', 'cuerpo', ['BRA', 'ZO'], 2, '💪'),
  palabra('PIERNA', 'cuerpo', ['PIER', 'NA'], 2, '🦵'),
  palabra('ESPALDA', 'cuerpo', ['ES', 'PAL', 'DA'], 3, '🧍'),
];
