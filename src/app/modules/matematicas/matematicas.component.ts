import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface ShapeItem {
  name: string;
  key: string;
  image: string;
}

@Component({
  selector: 'app-matematicas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matematicas.component.html',
  styleUrls: ['./matematicas.component.css']
})
export class MatematicasComponent implements OnInit {
  
  // ==========================================
  // CONFIGURACIÓN GENERAL Y NAVEGACIÓN
  // ==========================================
  activeTab: string = 'sums'; // Inicia en la pestaña de sumas

  constructor(private router: Router) {}

  ngOnInit() {
    this.generateSumsGame();
    this.generateCountingGame();
    this.generateShapesGame();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Lee el primer ejercicio al iniciar la aplicación si está en sumas
    if (this.activeTab === 'sums' && !this.sumsCompleted) {
      this.speak(`¿Cuánto es ${this.numA} más ${this.numB} manzanas?`);
    }
  }

  // Redirige al menú principal (inicio)
  onVolverMenu() {
    this.router.navigate(['/inicio']);
  }

  // Controla el cambio entre pestañas y la voz asociada
  switchTab(tab: string) {
    this.activeTab = tab;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // 🍎 Pestaña de Sumas
    if (tab === 'sums') {
      if (this.sumChoices.length === 0 && !this.sumsCompleted) {
        this.generateSumsGame();
      } else if (!this.sumsCompleted) {
        this.speak(`¿Cuánto es ${this.numA} más ${this.numB} manzanas?`);
      }
    }

    // ⭐ Pestaña de Conteo
    if (tab === 'count') {
      if (this.countingChoices.length === 0 && !this.countCompleted) {
        this.generateCountingGame();
      } else if (!this.countCompleted) {
        this.speak(`¿Cuántas estrellas hay? Cuenta con cuidado.`);
      }
    }

    // 🔴 Pestaña de Formas
    if (tab === 'shapes' && !this.shapesCompleted) {
      this.speak(`Toca el ${this.targetShape.name}`);
    }
  }

  // Sistema de síntesis de voz (Text-to-Speech nativo)
  speak(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.95;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  }


  // ==========================================
  // 🍎 SECCIÓN 1: SUMAS CON MANZANAS (Meta: 10)
  // ==========================================
  sumsScore: number = 0;
  numA: number = 2;
  numB: number = 1;
  sumAnswer: number = 3;
  applesGroupA: number[] = [];
  applesGroupB: number[] = [];
  sumChoices: number[] = [];
  sumFeedback: string = '';
  sumsCompleted: boolean = false;

  generateSumsGame() {
    if (this.sumsScore >= 10) return;
    this.numA = Math.floor(Math.random() * 4) + 1;
    this.numB = Math.floor(Math.random() * 4) + 1;
    this.sumAnswer = this.numA + this.numB;
    
    this.applesGroupA = Array(this.numA).fill(0);
    this.applesGroupB = Array(this.numB).fill(0);
    this.sumFeedback = '';

    const opts = new Set<number>();
    opts.add(this.sumAnswer);
    while (opts.size < 3) {
      const val = Math.floor(Math.random() * 8) + 1;
      opts.add(val);
    }
    this.sumChoices = Array.from(opts).sort(() => Math.random() - 0.5);

    if (this.activeTab === 'sums') {
      this.speak(`¿Cuánto es ${this.numA} más ${this.numB} manzanas?`);
    }
  }

  checkSum(num: number) {
    if (this.sumsCompleted) return;

    if (num === this.sumAnswer) {
      this.sumsScore++;
      if (this.sumsScore >= 10) {
        this.sumsCompleted = true;
        this.speak('¡Excelente! Has completado todas las sumas.');
      } else {
        this.generateSumsGame();
        const palabraAcierto = this.sumsScore === 1 ? 'acierto' : 'aciertos';
        this.speak(`¡Muy bien! Llevas ${this.sumsScore} ${palabraAcierto}. ¿Cuánto es ${this.numA} más ${this.numB} manzanas?`);
      }
    } else {
      //this.sumFeedback = 'Inténtalo otra vez. Suma todas las manzanas.';
      this.speak(`Inténtalo otra vez. ¿Cuánto es ${this.numA} más ${this.numB} manzanas?`);
    }
  }


  // ==========================================
  // ⭐ SECCIÓN 2: CONTEO DE ESTRELLAS (Meta: 10)
  // ==========================================
  countScore: number = 0;
  targetCount: number = 5;
  starsArray: number[] = [];
  countingChoices: number[] = [];
  countingFeedback: string = '';
  countCompleted: boolean = false;

  generateCountingGame() {
    if (this.countScore >= 10) return;
    this.targetCount = Math.floor(Math.random() * 8) + 3;
    this.starsArray = Array(this.targetCount).fill(0);
    this.countingFeedback = '';

    const opts = new Set<number>();
    opts.add(this.targetCount);
    while (opts.size < 3) {
      const val = this.targetCount + (Math.floor(Math.random() * 5) - 2);
      if (val > 0 && val !== this.targetCount) opts.add(val);
    }
    this.countingChoices = Array.from(opts).sort(() => Math.random() - 0.5);

    if (this.activeTab === 'count') {
      this.speak(`¿Cuántas estrellas hay? ¡Cuenta con cuidado!`);
    }
  }

  checkCounting(num: number) {
    if (this.countCompleted) return;

    if (num === this.targetCount) {
      this.countScore++;
      if (this.countScore >= 10) {
        this.countCompleted = true;
        this.speak('¡Felicidades! Has completado el juego de conteo.');
      } else {
        //this.countingFeedback = `¡Correcto! (${this.countScore}/10) ⭐`;
        this.generateCountingGame();
        const palabraAcierto = this.countScore === 1 ? 'acierto' : 'aciertos';
        this.speak(`¡Muy bien! Llevas ${this.countScore} ${palabraAcierto}. ¿Cuántas estrellas hay ahora?`);
      }
    } else {
      //this.countingFeedback = 'Inténtalo de nuevo, ¡cuenta con cuidado!';
      this.speak(`Inténtalo de nuevo. ¡cuenta con cuidado! ¿Cuántas estrellas hay?`);
    }
  }


  // ==========================================
  // 🔴 SECCIÓN 3: FORMAS GEOMÉTRICAS (Meta: 10)
  // ==========================================
  shapesScore: number = 0;
  shapesList: ShapeItem[] = [
    { name: 'CÍRCULO', key: 'circulo', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSECtlix7MwrT0KdHeRBRcSKR7bt97WYK9zCZDJ4iv8VQ&s=10' },
    { name: 'CUADRADO', key: 'cuadrado', image: 'https://charatoon.com/photo/7147.png' },
    { name: 'TRIÁNGULO', key: 'triangulo', image: 'https://illustoon.com/photo/7451.png' },
    { name: 'RECTÁNGULO', key: 'rectangulo', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8e6zTrfz7dzrCuN_uh3uNaGWSNQq47AWriN-LMPDI5Q&s=10' },
    { name: 'ESTRELLA', key: 'estrella', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFOW63m8Pd0Zb9JetkKkRosEbqspPDoL6pOlTInOjkpA&s=10' },
    { name: 'CORAZÓN', key: 'corazon', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS776-Jrv2p5dQ1WeB-YbsM31rFlx36pS-1bAzDX6OFAA&s=10' },
    { name: 'ROMBO', key: 'rombo', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWH3Zoqrbfv0qpd7hgSF0mVSRLvQ4L57Q_PachdRxM8g&s=10' },
    { name: 'PRISMA', key: 'prisma', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfhEZkzJdyTPuVwW5RcNPNsZm-4qzDk7A-MBPG5dOUsA&s=10' },
    { name: 'ESFERA', key: 'esfera', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI1PLDknBgl2YI7sVFwkq_5XAb3Ffkhd3zZXCPCVpc1Q&s=10' },
    { name: 'PIRÁMIDE', key: 'piramide', image: 'https://cdn-icons-png.flaticon.com/512/6181/6181288.png' },
    { name: 'CONO', key: 'cono', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1vb9pejQO1AQLzGRjg3VuhghXP4yq1Qq0rQcC9bVAyA&s=10' },
    { name: 'CILINDRO', key: 'cilindro', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJLqEheNByJnDUcNSNGxOhBY0nzaxIMVknZGAWjrRHhg&s=10' },
    { name: 'CUBO', key: 'cubo', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMHuJ95XFUdxOaVkv5m00WAFiRgmb7v4IIn9mvdBfVfQ&s=10' },
    { name: 'PENTÁGONO', key: 'pentagono', image: 'https://illustoon.com/photo/7421.png' },
    { name: 'HEXAGONO', key: 'hexagono', image: 'https://charatoon.com/photo/9238.png' }
  ];
  targetShape: ShapeItem = { name: 'CÍRCULO', key: 'circulo', image: '' };
  shapesChoices: ShapeItem[] = [];
  shapesFeedback: string = '';
  shapesCompleted: boolean = false;

  generateShapesGame() {
    if (this.shapesScore >= 10) return;
    const randomIndex = Math.floor(Math.random() * this.shapesList.length);
    this.targetShape = this.shapesList[randomIndex];
    this.shapesChoices = [...this.shapesList].sort(() => Math.random() - 0.5);
    this.shapesFeedback = '';
    
    if (this.activeTab === 'shapes') {
      this.speak(`Toca el ${this.targetShape.name}`);
    }
  }

  checkShape(selectedKey: string) {
    if (this.shapesCompleted) return;

    if (selectedKey === this.targetShape.key) {
      this.shapesScore++;
      if (this.shapesScore >= 10) {
        this.shapesCompleted = true;
        this.speak('¡Increíble! Has dominado las formas geométricas.');
      } else {
        //this.shapesFeedback = `¡Genial! (${this.shapesScore}/10) 🔴`;
        this.generateShapesGame();
        const palabraAcierto = this.shapesScore === 1 ? 'acierto' : 'aciertos';
        this.speak(`¡Correcto! Llevas ${this.shapesScore} ${palabraAcierto}. Ahora, toca el ${this.targetShape.name}`);
      }
    } else {
      this.speak(`Esa no es la forma. ¡Inténtalo otra vez!. toca el ${this.targetShape.name}`);
    }
  }



  // ==========================================
  // 🔄 REINICIO DE SECCIONES
  // ==========================================
  reiniciarSeccion(tipo: string) {
    if (tipo === 'sums') {
      this.sumsScore = 0;
      this.sumsCompleted = false;
      this.generateSumsGame();
      this.speak(`¿Cuánto es ${this.numA} más ${this.numB} manzanas?`);
    } else if (tipo === 'count') {
      this.countScore = 0;
      this.countCompleted = false;
      this.generateCountingGame();
      this.speak(`¿Cuántas estrellas hay? Cuenta con cuidado.`);
    } else if (tipo === 'shapes') {
      this.shapesScore = 0;
      this.shapesCompleted = false;
      this.generateShapesGame();
      this.speak(`Toca el ${this.targetShape.name}`);
    }
  }
}