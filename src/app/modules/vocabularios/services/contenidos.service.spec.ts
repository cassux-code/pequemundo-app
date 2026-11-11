import { ContenidosService } from './contenidos.service';

describe('ContenidosService', () => {
  let service: ContenidosService;

  beforeEach(() => {
    localStorage.clear();
    service = new ContenidosService();
  });

  it('expone las 27 letras del alfabeto español (incluye Ñ)', async () => {
    const letras = await service.getLetras();
    expect(letras.length).toBe(27);
    expect(letras.some((l) => l.id === 'ñ')).toBe(true);
  });

  it('expone al menos 60 palabras distribuidas en 5 categorías', async () => {
    const palabras = await service.getPalabras();
    expect(palabras.length).toBeGreaterThanOrEqual(60);
    const categorias = new Set(palabras.map((p) => p.categoria));
    expect(categorias.size).toBe(5);
  });

  it('filtra palabras por categoría y nivel', async () => {
    const animalesNivel1 = await service.getPalabras({ categoria: 'animales', nivel: 1 });
    expect(animalesNivel1.every((p) => p.categoria === 'animales' && p.nivel === 1)).toBe(true);
  });

  it('crea, actualiza y elimina palabras del catálogo docente', async () => {
    const nueva = await service.crearPalabra({
      texto: 'LLAMA',
      categoria: 'animales',
      letraInicial: 'l',
      silabas: ['LLA', 'MA'],
      nivel: 1,
      recurso: { imagen: '🦙', textoAudio: 'LLAMA' },
    });

    let palabras = await service.getPalabras();
    expect(palabras.some((p) => p.id === nueva.id)).toBe(true);

    await service.actualizarPalabra(nueva.id, { nivel: 2 });
    palabras = await service.getPalabras();
    expect(palabras.find((p) => p.id === nueva.id)?.nivel).toBe(2);

    await service.eliminarPalabra(nueva.id);
    palabras = await service.getPalabras();
    expect(palabras.some((p) => p.id === nueva.id)).toBe(false);
  });
});
