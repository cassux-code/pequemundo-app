import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContenidosService } from '../services/contenidos.service';
import { Categoria, Nivel, Palabra } from '../types/vocabulario.types';

interface FormularioPalabra {
  texto: string;
  categoria: Categoria;
  nivel: Nivel;
  imagen: string;
  silabasTexto: string;
}

const FORM_VACIO: FormularioPalabra = {
  texto: '',
  categoria: 'animales',
  nivel: 1,
  imagen: '',
  silabasTexto: '',
};

@Component({
  selector: 'app-panel-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panel-docente.component.html',
  styleUrls: ['./panel-docente.component.css'],
})
export class PanelDocenteComponent implements OnInit {
  categorias: Categoria[] = ['animales', 'frutas', 'colores', 'familia', 'cuerpo'];
  palabras: Palabra[] = [];
  form: FormularioPalabra = { ...FORM_VACIO };
  editandoId: string | null = null;
  idParaEliminar: string | null = null;
  mensaje = '';

  constructor(private contenidos: ContenidosService) {}

  async ngOnInit(): Promise<void> {
    await this.cargar();
  }

  async cargar(): Promise<void> {
    this.palabras = await this.contenidos.getPalabras();
  }

  editar(palabra: Palabra): void {
    this.editandoId = palabra.id;
    this.form = {
      texto: palabra.texto,
      categoria: palabra.categoria,
      nivel: palabra.nivel,
      imagen: palabra.recurso.imagen,
      silabasTexto: palabra.silabas.join('-'),
    };
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.form = { ...FORM_VACIO };
  }

  async guardar(): Promise<void> {
    if (!this.form.texto.trim()) return;
    const silabas = this.form.silabasTexto.split('-').map((s) => s.trim()).filter(Boolean);
    const datos = {
      texto: this.form.texto.trim().toUpperCase(),
      categoria: this.form.categoria,
      nivel: this.form.nivel,
      letraInicial: this.form.texto.trim()[0].toLowerCase(),
      silabas: silabas.length ? silabas : [this.form.texto.trim().toUpperCase()],
      recurso: { imagen: this.form.imagen || '📖', textoAudio: this.form.texto.trim() },
    };

    if (this.editandoId) {
      await this.contenidos.actualizarPalabra(this.editandoId, datos);
      this.mensaje = 'Palabra actualizada correctamente.';
    } else {
      await this.contenidos.crearPalabra(datos);
      this.mensaje = 'Palabra creada correctamente.';
    }
    this.cancelarEdicion();
    await this.cargar();
  }

  /** Confirmación explícita antes de borrar (acción de adulto, Nielsen #5). */
  pedirConfirmacionEliminar(id: string): void {
    this.idParaEliminar = id;
  }

  cancelarEliminar(): void {
    this.idParaEliminar = null;
  }

  async confirmarEliminar(): Promise<void> {
    if (!this.idParaEliminar) return;
    await this.contenidos.eliminarPalabra(this.idParaEliminar);
    this.idParaEliminar = null;
    this.mensaje = 'Palabra eliminada.';
    await this.cargar();
  }
}
