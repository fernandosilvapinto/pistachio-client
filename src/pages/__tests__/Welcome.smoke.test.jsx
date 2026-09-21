import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Welcome from '../Welcome';

vi.mock('../../api/client', () => ({
  api: { get: vi.fn(() => Promise.resolve([])) },
}));

describe('Welcome', () => {
  it('renderiza sem rebentar e mostra a secção de serviços', async () => {
    render(
      <MemoryRouter>
        <Welcome />
      </MemoryRouter>,
    );

    expect(await screen.findByText('Os nossos serviços')).toBeInTheDocument();
  });
});
