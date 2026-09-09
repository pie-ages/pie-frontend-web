/**
 * Paleta de cores do frontend web, para uso em JS/TS (estilos inline, lógica de tema, etc.).
 * Fonte única de verdade junto com app/styles/colors.css — os valores devem ser mantidos iguais.
 * Alterar a identidade visual = alterar os valores aqui.
 */
export const colors = {
  brand: {
    primary: '#5e1914',
    primaryHover: '#4a1410',
    primaryLight: '#fae8e3',
    primaryLightHover: '#f5d9d1',
  },
  text: {
    primary: '#111827',
    secondary: '#374151',
    muted: '#6b7280',
    inverse: '#ffffff',
    inverseMuted: '#e5e7eb',
    inverseSubtle: '#d1d5db',
  },
  background: {
    default: '#ffffff',
    subtle: '#f3f4f6',
    brand: '#5e1914',
  },
  border: {
    default: '#d1d5db',
    focus: '#5e1914',
    dividerInverse: 'rgba(255, 255, 255, 0.2)',
  },
  state: {
    error: '#dc2626',
  },
} as const;
