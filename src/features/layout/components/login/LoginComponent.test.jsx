import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginComponent } from './LoginComponent';

// Mock de hooks y servicios externos para evitar llamadas de red
jest.mock('../../hook/useFetchFecha', () => ({
  __esModule: true,
  default: () => ({ fecha: { rangoFecha: '2025-2026' } }),
}));

jest.mock('../../service/bannerService', () => ({
  getFechas: jest.fn().mockResolvedValue({ rangoFecha: '2025-2026' }),
}));

describe('LoginComponent Tests', () => {
  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <LoginComponent />
      </BrowserRouter>
    );
  };

  test('Renderiza los campos de usuario, contraseña y botón de ingresar', () => {
    renderLogin();

    expect(screen.getByLabelText(/USUARIO \/ CÓDIGO/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/CONTRASEÑA/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  test('Muestra mensaje de error si se intenta ingresar con campos vacíos', async () => {
    renderLogin();

    const submitBtn = screen.getByRole('button', { name: /ingresar/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Todos los campos son obligatorios/i)).toBeInTheDocument();
    });
  });

  test('Contiene el enlace de soporte a la mesa de ayuda con atributos seguros', () => {
    renderLogin();

    const linkAyuda = screen.getByRole('link', { name: /solicita ayuda aquí/i });
    expect(linkAyuda).toBeInTheDocument();
    expect(linkAyuda).toHaveAttribute(
      'href',
      expect.stringContaining('script.google.com/macros/s/')
    );
    expect(linkAyuda).toHaveAttribute('target', '_blank');
    expect(linkAyuda).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
