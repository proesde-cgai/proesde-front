import axios from 'axios';
import { login } from './authService';

jest.mock('axios');

// Token JWT válido en formato Header.Payload.Signature
// Payload decodificado: { "sub": "123456", "roles": ["ACADEMICO"], "exp": 1999999999 }
const VALID_MOCK_JWT = 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJyb2xlcyI6WyJBQ0FERU1JQ08iXSwiZXhwIjoxOTk5OTk5OTk5fQ.mockSignature';

describe('authService Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    // axios.get para la verificación previa de versión del frontend
    axios.get.mockResolvedValue({ data: { valido: true } });
  });

  test('login exitoso retorna accessToken, refreshToken y roles', async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        accessToken: VALID_MOCK_JWT,
        refreshToken: 'mock-refresh-token',
      },
    });

    const result = await login('123456', 'pass123');

    expect(result).toBeDefined();
    expect(result.accessToken).toBe(VALID_MOCK_JWT);
    expect(result.refreshToken).toBe('mock-refresh-token');
    expect(result.rolesAsArray).toContain('ACADEMICO');
    expect(localStorage.getItem('userName')).toBe('123456');
    expect(localStorage.getItem('accessToken')).toBe(VALID_MOCK_JWT);
  });

  test('login con status 403 lanza mensaje con enlace de ayuda', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 403,
        data: 'Acceso no permitido',
      },
    });

    await expect(login('123456', 'badpass')).rejects.toThrow(
      /Solicita ayuda aquí/i
    );
  });

  test('login con credenciales inválidas (401 o mensaje genérico) propaga el error', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { mensaje: 'Usuario y/o contraseña incorrectos' },
      },
    });

    await expect(login('wrong_user', 'wrong_pass')).rejects.toThrow(
      /Usuario y\/o contraseña incorrectos/i
    );
  });
});
