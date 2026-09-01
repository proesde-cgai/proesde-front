import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock de servicios y hooks de diseño para el arranque de App
jest.mock('./features/layout/service/bannerService', () => ({
  getFechas: jest.fn().mockResolvedValue({ rangoFecha: '2025-2026' }),
  getFechasPublic: jest.fn().mockResolvedValue({ rangoFecha: '2025-2026' }),
  getBannerPublic: jest.fn().mockResolvedValue('mock-logo-base64'),
}));

jest.mock('./features/layout/hook/useFetchFecha', () => ({
  __esModule: true,
  default: () => ({
    fecha: { rangoFecha: '2025-2026' },
    loading: false,
    error: null,
  }),
}));

jest.mock('./features/layout/hook/useFetchLogo', () => ({
  __esModule: true,
  default: () => ({
    logo: 'mock-logo',
    loading: false,
    error: null,
  }),
}));

test('renders App successfully inside MemoryRouter', async () => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
  });

  // Debe renderizar la vista de login en la ruta inicial
  expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
});
