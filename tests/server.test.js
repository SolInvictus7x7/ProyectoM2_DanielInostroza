import { describe, test, expect } from 'vitest';
import request from 'supertest';
import app from '../server';

describe('POST /usuarios', () => {
  test('crea usuario con datos válidos', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({ nombre: 'Juan', email: 'juan@example.com' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toBe('Juan');
    expect(response.body.email).toBe('juan@example.com');
  });

  test('rechaza request sin nombre', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({ email: 'juan@example.com' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('requeridos');
  });

  test('rechaza request sin email', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({ nombre: 'Juan' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('requeridos');
  });

  test('rechaza request vacío', async () => {
    const response = await request(app)
      .post('/usuarios')
      .send({});

    expect(response.statusCode).toBe(400);
  });
});