import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ProgresoService } from '../../services/progreso.service';

type Pestana = 'metricas' | 'insignias' | 'reporte';

// MÓDULO 5: Logros y Reportes (Eliana Ruiz)
@Component({
  selector: 'app-logros-reportes',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './logros-reportes.component.html',
  styleUrls: ['./logros-reportes.component.css']
})
export class LogrosReportesComponent {
  auth = inject(AuthService);
  progreso = inject(ProgresoService);

  pestana = signal<Pestana>('metricas');
  hoy = new Date();

  // Solo padres/tutores y maestros pueden ver y exportar el reporte
  puedeVerReporte = computed(() => this.auth.rolUsuario() !== 'alumno');

  maxMinutos = computed(() => Math.max(1, ...this.progreso.minutosSemana().map(d => d.minutos)));

  // Gráfico circular de precisión (conic-gradient)
  donut = computed(() => `conic-gradient(#16a34a ${this.progreso.precision() * 3.6}deg, #e2e8f0 0deg)`);

  cambiar(p: Pestana) {
    this.pestana.set(p);
  }

  nivelPrecision(p: number): string {
    if (p >= 85) return 'Excelente';
    if (p >= 70) return 'Muy bien';
    if (p >= 50) return 'En progreso';
    return 'Necesita apoyo';
  }

  // ===== Exportación a PDF: usa el diálogo de impresión del navegador ("Guardar como PDF") =====
  exportarPDF() {
    window.print();
  }

  // ===== Exportación a Excel: CSV con BOM UTF-8 (se abre directo en Excel con tildes correctas) =====
  exportarExcel() {
    const p = this.progreso;
    const fila = (...c: (string | number)[]) => c.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';');

    const lineas: string[] = [
      fila('REPORTE DE DESEMPEÑO - PEQUEMUNDO'),
      fila('Generado por', this.auth.nombreUsuario()),
      fila('Fecha', this.hoy.toLocaleDateString('es-EC')),
      '',
      fila('RESUMEN GENERAL'),
      fila('Estrellas acumuladas', p.estrellas()),
      fila('Tiempo de juego (min)', p.minutos()),
      fila('Precisión (%)', p.precision()),
      fila('Actividades completadas', p.actividades()),
      fila('Insignias desbloqueadas', `${p.desbloqueadas()} de ${p.insignias().length}`),
      '',
      fila('RESUMEN POR MÓDULO'),
      fila('Módulo', 'Aciertos', 'Intentos', 'Precisión (%)', 'Minutos', 'Estrellas'),
      ...p.resumenModulos().map(m => fila(m.modulo, m.aciertos, m.intentos, m.precision, m.minutos, m.estrellas)),
      '',
      fila('DETALLE DE ACTIVIDADES'),
      fila('Fecha', 'Módulo', 'Actividad', 'Aciertos', 'Intentos', 'Minutos', 'Estrellas'),
      ...p.registros().map(r => fila(r.fecha, r.modulo, r.actividad, r.aciertos, r.intentos, r.minutos, r.estrellas)),
      '',
      fila('INSIGNIAS'),
      fila('Insignia', 'Descripción', 'Estado'),
      ...p.insignias().map(i => fila(i.nombre, i.descripcion, i.desbloqueada ? 'Desbloqueada' : `Bloqueada (${i.porcentaje}%)`))
    ];

    const blob = new Blob(['﻿' + lineas.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-pequemundo-${this.hoy.toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
