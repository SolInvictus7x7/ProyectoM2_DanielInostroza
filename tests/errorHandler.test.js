import { describe, test, expect, vi } from 'vitest';
const { errorHandler } = require('../src/errorHandler.js');

describe('ErrorHandler Unit Tests', () => {
  
  const createMockReq = () => ({});
  const createMockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };
  const next = vi.fn();

  test('debe responder con status 500 y mensaje por defecto si el error no tiene status', () => {
    const req = createMockReq();
    const res = createMockRes();
    const error = new Error('Algo salió mal');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Algo salió mal',
      status: 500
    });
  });

  test('debe usar el status code personalizado si el error lo tiene', () => {
    const req = createMockReq();
    const res = createMockRes();
    const error = new Error('No autorizado');
    error.status = 401;

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'No autorizado',
      status: 401
    });
  });

  test('debe responder con "Error interno del servidor" si el error no tiene mensaje', () => {
    const req = createMockReq();
    const res = createMockRes();
    const error = {}; // Error vacío sin mensaje ni status

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Error interno del servidor',
      status: 500
    });
  });

});