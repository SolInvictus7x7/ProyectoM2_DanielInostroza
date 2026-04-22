import { describe, test, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../server.js';
import pool from '../db/config.js';

// Limpia la tabla de autores antes de empezar para que el email esté libre
beforeAll(async () => {
  await pool.query('DELETE FROM authors WHERE email = $1', ['juan@example.com']);
});

describe('POST /api/authors', () => {
  test('crea usuario con datos válidos', async () => {
    const response = await request(app)
      .post('/api/authors')
      .send({ name: 'Juan', email: 'juan@example.com' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Juan');
    expect(response.body.email).toBe('juan@example.com');
  });

  test('rechaza request sin nombre', async () => {
    const response = await request(app)
      .post('/api/authors')
      .send({ email: 'juan@example.com' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('vacío');
  });

  test('rechaza request sin email', async () => {
    const response = await request(app)
      .post('/api/authors')
      .send({ name: 'Juan' });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('requerido');
  });

  test('rechaza request vacío', async () => {
    const response = await request(app)
      .post('/api/authors')
      .send({});

    expect(response.statusCode).toBe(400);
  });
});