import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ManageBooking from '../ManageBooking';
import { ToastProvider } from '../../context/ToastContext';

const marcacao = {
  id: 1,
  serviceId: 1,
  serviceName: 'Revisão geral',
  customerName: 'Ana Ferreira',
  startsAt: '2026-10-01T10:00:00Z',
  durationMinutes: 60,
  status: 'Confirmed',
  canCancel: true,
};

vi.mock('../../api/client', () => ({
  api: { get: vi.fn(() => Promise.resolve(marcacao)) },
  ApiError: class ApiError extends Error {},
}));

describe('ManageBooking', () => {
  it('renderiza sem rebentar e mostra a marcação carregada', async () => {
    render(
      <MemoryRouter initialEntries={['/marcacoes/abc123']}>
        <ToastProvider>
          <Routes>
            <Route path="/marcacoes/:token" element={<ManageBooking />} />
          </Routes>
        </ToastProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText('A tua marcação')).toBeInTheDocument();
    expect(screen.getByText('Ana Ferreira')).toBeInTheDocument();
  });
});
