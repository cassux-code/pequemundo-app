import { Component, ElementRef, ViewChild, AfterViewInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Nota { nombre: string; freq: number; color: string; }
interface Efecto { icono: string; nombre: string; archivo: string; }

@Component({
  selector: 'app-arte-sonido',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './arte-sonido.component.html',
  styleUrls: ['./arte-sonido.component.css']
})
export class ArteSonidoComponent implements AfterViewInit {
  @ViewChild('lienzo') lienzoRef!: ElementRef<HTMLCanvasElement>;

  // ---------- Lienzo ----------
  color = signal('#0284c7');
  grosor = signal(6);
  borrador = signal(false);
  private ctx!: CanvasRenderingContext2D;
  private dibujando = false;

  // ---------- Xilófono (Do a Si + Do agudo) ----------
  notas: Nota[] = [
    { nombre: 'Do', freq: 261.63, color: '#ef4444' },
    { nombre: 'Re', freq: 293.66, color: '#f97316' },
    { nombre: 'Mi', freq: 329.63, color: '#eab308' },
    { nombre: 'Fa', freq: 349.23, color: '#22c55e' },
    { nombre: 'Sol', freq: 392.0, color: '#06b6d4' },
    { nombre: 'La', freq: 440.0, color: '#3b82f6' },
    { nombre: 'Si', freq: 493.88, color: '#8b5cf6' },
    { nombre: 'Do', freq: 523.25, color: '#ec4899' }
  ];
  notaActiva = signal(-1);

  // ---------- Efectos de sonido ----------
  // Si existe el .mp3 en public/sounds/ se usa; si no, se genera un sonido sintético.
  efectos: Efecto[] = [
    { icono: '🌧️', nombre: 'Lluvia', archivo: 'sounds/lluvia.mp3' },
    { icono: '🌬️', nombre: 'Viento', archivo: 'sounds/viento.mp3' },
    { icono: '🐦', nombre: 'Pájaro', archivo: 'sounds/pajaro.mp3' },
    { icono: '🐶', nombre: 'Perro', archivo: 'sounds/perro.mp3' },
    { icono: '🐱', nombre: 'Gato', archivo: 'sounds/gato.mp3' },
    { icono: '🐮', nombre: 'Vaca', archivo: 'sounds/vaca.mp3' },
    { icono: '🐸', nombre: 'Rana', archivo: 'sounds/rana.mp3' }
  ];

  private audioCtx?: AudioContext;

  ngAfterViewInit() {
    const canvas = this.lienzoRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.limpiar();
  }

  // ===== Lienzo =====
  private posicion(e: PointerEvent) {
    const canvas = this.lienzoRef.nativeElement;
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (canvas.width / r.width),
      y: (e.clientY - r.top) * (canvas.height / r.height)
    };
  }

  empezar(e: PointerEvent) {
    this.dibujando = true;
    this.lienzoRef.nativeElement.setPointerCapture(e.pointerId);
    const { x, y } = this.posicion(e);
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.trazar(x, y); // punto al hacer un solo clic
  }

  mover(e: PointerEvent) {
    if (!this.dibujando) return;
    const { x, y } = this.posicion(e);
    this.trazar(x, y);
  }

  terminar() {
    this.dibujando = false;
    this.ctx.beginPath();
  }

  private trazar(x: number, y: number) {
    this.ctx.lineWidth = this.grosor();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.borrador() ? '#ffffff' : this.color();
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  cambiarColor(e: Event) {
    this.color.set((e.target as HTMLInputElement).value);
    this.borrador.set(false);
  }

  cambiarGrosor(e: Event) {
    this.grosor.set(+(e.target as HTMLInputElement).value);
  }

  limpiar() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.lienzoRef.nativeElement.width, this.lienzoRef.nativeElement.height);
  }

  descargar() {
    const a = document.createElement('a');
    a.href = this.lienzoRef.nativeElement.toDataURL('image/png');
    a.download = 'mi-dibujo-pequemundo.png';
    a.click();
  }

  // ===== Audio =====
  private ac(): AudioContext {
    if (!this.audioCtx) this.audioCtx = new AudioContext();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    return this.audioCtx;
  }

  tocarNota(i: number) {
    const ac = this.ac();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'triangle';
    osc.frequency.value = this.notas[i].freq;
    gain.gain.setValueAtTime(0.0001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.6, ac.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 1.0);
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 1.0);

    this.notaActiva.set(i);
    setTimeout(() => this.notaActiva.set(-1), 180);
  }

  reproducirEfecto(ef: Efecto) {
    const audio = new Audio(ef.archivo);
    audio.play().catch(() => this.sintetizar(ef.nombre));
    audio.onerror = () => this.sintetizar(ef.nombre);
  }

  // Sonidos aproximados generados con Web Audio (respaldo si no hay .mp3)
  private sintetizar(nombre: string) {
    const ac = this.ac();
    const t = ac.currentTime;

    const tono = (tipo: OscillatorType, f1: number, f2: number, ini: number, dur: number, vol = 0.4) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = tipo;
      o.frequency.setValueAtTime(f1, t + ini);
      o.frequency.linearRampToValueAtTime(f2, t + ini + dur);
      g.gain.setValueAtTime(0.0001, t + ini);
      g.gain.exponentialRampToValueAtTime(vol, t + ini + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + ini + dur);
      o.connect(g).connect(ac.destination);
      o.start(t + ini);
      o.stop(t + ini + dur + 0.05);
    };

    const ruido = (dur: number, freqFiltro: number, vol: number, tipoFiltro: BiquadFilterType = 'lowpass') => {
      const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ac.createBufferSource();
      src.buffer = buf;
      const f = ac.createBiquadFilter();
      f.type = tipoFiltro;
      f.frequency.value = freqFiltro;
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f).connect(g).connect(ac.destination);
      src.start(t);
    };

    switch (nombre) {
      case 'Lluvia': ruido(2.5, 4000, 0.5, 'highpass'); break;
      case 'Viento': ruido(2.5, 600, 0.8); break;
      case 'Pájaro': for (let i = 0; i < 4; i++) tono('sine', 2200, 3200, i * 0.16, 0.12, 0.3); break;
      case 'Perro': tono('sawtooth', 400, 250, 0, 0.15); tono('sawtooth', 400, 250, 0.25, 0.15); break;
      case 'Gato': tono('sawtooth', 500, 900, 0, 0.35, 0.3); tono('sawtooth', 900, 500, 0.35, 0.4, 0.3); break;
      case 'Vaca': tono('sawtooth', 130, 100, 0, 1.2, 0.35); break;
      case 'Rana': for (let i = 0; i < 3; i++) tono('square', 180, 120, i * 0.22, 0.12, 0.25); break;
    }
  }
}
