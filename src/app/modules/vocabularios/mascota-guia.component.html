import { IntentosService } from './intentos.service';

describe('IntentosService (repetición espaciada tipo Leitner)', () => {
  let service: IntentosService;

  beforeEach(() => {
    localStorage.clear();
    service = new IntentosService();
  });

  it('un acierto sube la caja Leitner del elemento', async () => {
    expect(service.getCaja('gato')).toBe(1);
    await service.registrarIntento({
      ninoId: 'n1',
      actividad: 'encuentra-letra',
      itemId: 'gato',
      acierto: true,
      tiempoMs: 1000,
      nivel: 1,
    });
    expect(service.getCaja('gato')).toBe(2);
  });

  it('un fallo reinicia el elemento a la caja 1', async () => {
    await service.registrarIntento({
      ninoId: 'n1',
      actividad: 'encuentra-letra',
      itemId: 'gato',
      acierto: true,
      tiempoMs: 1000,
      nivel: 1,
    });
    await service.registrarIntento({
      ninoId: 'n1',
      actividad: 'encuentra-letra',
      itemId: 'gato',
      acierto: false,
      tiempoMs: 1000,
      nivel: 1,
    });
    expect(service.getCaja('gato')).toBe(1);
  });

  it('la cola de repetición prioriza elementos en cajas bajas (fallados)', async () => {
    const items = [{ id: 'gato' }, { id: 'perro' }];
    await service.registrarIntento({
      ninoId: 'n1',
      actividad: 'encuentra-letra',
      itemId: 'perro',
      acierto: true,
      tiempoMs: 1000,
      nivel: 1,
    });
    await service.registrarIntento({
      ninoId: 'n1',
      actividad: 'encuentra-letra',
      itemId: 'perro',
      acierto: true,
      tiempoMs: 1000,
      nivel: 1,
    });

    const cola = service.construirColaRepeticion(items);
    const vecesGato = cola.filter((i) => i.id === 'gato').length;
    const vecesPerro = cola.filter((i) => i.id === 'perro').length;
    expect(vecesGato).toBeGreaterThan(vecesPerro);
  });

  it('cuenta los fallos recientes de un elemento en una actividad', async () => {
    await service.registrarIntento({
      ninoId: 'n1',
      actividad: 'completa-palabra',
      itemId: 'gato',
      acierto: false,
      tiempoMs: 1000,
      nivel: 1,
    });
    await service.registrarIntento({
      ninoId: 'n1',
      actividad: 'completa-palabra',
      itemId: 'gato',
      acierto: false,
      tiempoMs: 1000,
      nivel: 1,
    });
    expect(service.contarFallosRecientes('gato', 'completa-palabra')).toBe(2);
  });
});
