:host {
  display: block;
}

/* Similitud (Gestalt): todas las letras comparten forma, tamaño y color base */
.abc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 0.75rem;
}

.abc-boton {
  min-height: 64px;
  border: 3px solid var(--vocab-color-borde, #1e1b4b);
  border-radius: var(--vocab-radio, 16px);
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 4px 0px #cbd5e1;
  transition: transform 0.08s ease;
}

.abc-boton:hover {
  background: var(--vocab-color-superficie, #fff7ed);
}

.abc-boton:active {
  transform: translateY(3px);
}

.abc-boton:focus-visible {
  outline: 3px solid var(--vocab-color-foco, #fbbf24);
  outline-offset: 2px;
}

.abc-activa {
  background: var(--vocab-color-primario, #7c3aed);
  border-color: var(--vocab-color-primario, #7c3aed);
}

.abc-activa .abc-letra {
  color: #ffffff;
}

.abc-letra {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--vocab-color-texto, #1e1b4b);
}

/* Región común (Gestalt): tarjeta de detalle con borde redondeado propio */
.abc-detalle {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--vocab-color-superficie, #fff7ed);
  border: 4px solid var(--vocab-color-secundario, #fb923c);
  border-radius: var(--vocab-radio, 20px);
}

.abc-detalle-imagen {
  font-size: 4rem;
}

.abc-detalle-letra {
  margin: 0;
  font-size: 2rem;
  color: var(--vocab-color-texto, #1e1b4b);
}

.abc-detalle-palabra {
  margin: 0.25rem 0 0.75rem;
  font-weight: 700;
  color: var(--vocab-color-secundario, #c2410c);
}

.abc-detalle-escuchar {
  min-height: 48px;
  padding: 0.5rem 1rem;
  border: 2px solid var(--vocab-color-texto, #1e1b4b);
  border-radius: 14px;
  background: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

@media screen and (max-width: 480px) {
  .abc-grid {
    grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
  }

  .abc-detalle {
    flex-direction: column;
    text-align: center;
  }
}
