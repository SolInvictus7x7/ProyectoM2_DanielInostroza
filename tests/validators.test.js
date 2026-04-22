import { describe, test, expect } from 'vitest';
const { 
  validarEmail, 
  validarNombre, 
  validarTexto, 
  validarId 
} = require('../src/validators.js');

describe('Validators Unit Tests', () => {

  describe('validarNombre', () => {
    test('debe retornar null si el nombre es válido', () => {
      expect(validarNombre('Daniel')).toBeNull();
    });

    test('debe rechazar nombres vacíos o con puros espacios', () => {
      const resultado = validarNombre('   ');
      // Ahora comparamos el resultado directo, ya que es un string
      expect(resultado).toBe('El nombre no puede estar vacío');
    });

    test('debe rechazar nombres de menos de 3 caracteres', () => {
      const resultado = validarNombre('Ab');
      expect(resultado).toBe('El nombre debe tener al menos 3 caracteres');
    });
  });

  describe('validarEmail', () => {
    test('debe retornar null para un email válido', () => {
      expect(validarEmail('test@example.com')).toBeNull();
    });

    test('debe rechazar formatos sin arroba o sin punto', () => {
      expect(validarEmail('testexample.com')).toBe('El formato del email es inválido');
    });

    test('debe detectar emails demasiado largos', () => {
      const largoEmail = "a".repeat(65) + "@dominio.com";
      expect(validarEmail(largoEmail)).toBe('La parte local del email es demasiado larga');
    });
  });

  describe('validarTexto (para Posts)', () => {
    test('debe aceptar un texto válido', () => {
      expect(validarTexto('Mi primer post', 'título')).toBeNull();
    });

    test('debe incluir el nombre del campo en el mensaje de error', () => {
      const error = validarTexto('', 'contenido');
      expect(error).toBe('El campo contenido no puede estar vacío');
    });
  });

  describe('validarId', () => {
    test('debe aceptar números positivos', () => {
      expect(validarId(10)).toBeNull();
    });

    test('debe rechazar IDs inválidos', () => {
      expect(validarId(0)).toBe('El id debe ser un número válido');
      expect(validarId('abc')).toBe('El id debe ser un número válido');
    });
  });

});