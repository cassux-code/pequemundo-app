:host {
  display: inline-flex;
}

/* Heurística Nielsen #5 (prevención de errores): área táctil >= 64px en juegos */
.btn-grande {
  min-width: 64px;
  min-height: 64px;
  padding: 0.75rem 1.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 800;
  font-family: inherit;
  color: #ffffff;
  background: var(--vocab-color-primario, #7c3aed);
  border: 3px solid var(--vocab-color-borde, #1e1b4b);
  border-radius: var(--vocab-radio, 18px);
  box-shadow: 0 5px 0px var(--vocab-color-primario-sombra, #5b21b6);
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.08s ease;
}

.btn-grande:hover:not(:disabled) {
  filter: brightness(1.05);
}

.btn-grande:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: 0 2px 0px var(--vocab-color-primario-sombra, #5b21b6);
}

.btn-grande:focus-visible {
  outline: 3px solid var(--vocab-color-foco, #fbbf24);
  outline-offset: 2px;
}

.btn-grande:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-exito {
  background: var(--vocab-color-exito, #10b981);
  box-shadow: 0 5px 0px #047857;
}

.btn-alerta {
  background: var(--vocab-color-alerta, #ef4444);
  box-shadow: 0 5px 0px #b91c1c;
}

.btn-neutro {
  background: #ffffff;
  color: var(--vocab-color-texto, #1e1b4b);
  box-shadow: 0 5px 0px #cbd5e1;
}

.btn-grande-icono {
  font-size: 1.5rem;
}

@media (prefers-reduced-motion: reduce) {
  .btn-grande {
    transition: none;
  }
}

@media screen and (max-width: 480px) {
  .btn-grande {
    min-width: 56px;
    min-height: 56px;
    font-size: 1rem;
    padding: 0.6rem 1rem;
  }
}
