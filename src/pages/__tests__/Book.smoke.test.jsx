import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Book from '../Book';

// O widget real faz um pedido de rede ao carregar — não é isso que este
// teste de fumo quer exercitar, só que a página renderiza sem rebentar.
vi.mock('altcha', () => ({}));

vi.mock('../../api/client', () => ({
  api: { get: vi.fn(() => Promise.resolve([])) },
  ApiError: class ApiError extends Error {},
  API_BASE: 'http://localhost:5000/api',
}));

describe('Book', () => {
  it('renderiza sem rebentar e mostra o título de marcação', async () => {
    render(
      <MemoryRouter initialEntries={['/book']}>
        <Book />
      </MemoryRouter>,
    );

    // Este é exatamente o teste que teria apanhado o bug de temporal dead
    // zone do "servico" usado no useEffect antes de ser declarado: nesse
    // caso o render atirava ReferenceError e o findByRole nunca resolvia.
    expect(await screen.findByRole('heading', { name: 'Marcar' })).toBeInTheDocument();
  });
});
