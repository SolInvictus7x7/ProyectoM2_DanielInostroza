const { loadEnvFile } = require('node:process');
const express = require('express');
const router = express.Router();
const pool = require('../db/config');
const { validarEmail, validarNombre, validarId } = require('../src/validators.js');

//Endpoint GET todos los autores
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM authors ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/authors/:id - Obtener un autor por ID
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM authors WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// POST /api/authors - Crear un nuevo autor
router.post('/', async (req, res, next) => {
  const { name, email, bio } = req.body;
  
  const errorNombre = validarNombre(name);
  if (errorNombre) {
    return res.status(400).json({ error: errorNombre });
  }
  
  //VALIDAR EMAIL
  const errorEmail = validarEmail(email); 
  if (errorEmail) {
    return res.status(400).json({ error: errorEmail });
  }

  try {
    const result = await pool.query(
      'INSERT INTO authors (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
      [name, email, bio || null]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      error.status = 409;
      error.message = 'El email ya está registrado';
    }
    next(error);
  }
});

// PUT /api/authors/:id - Actualizar un autor
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, email, bio } = req.body;

  // 1. Validar ID de la URL
  const errorId = validarId(id);
  if (errorId) return res.status(400).json({ error: errorId });

  // 2. Validar campos solo si vienen en el body
  if (name !== undefined) {
    const errorNombre = validarNombre(name);
    if (errorNombre) return res.status(400).json({ error: errorNombre });
  }

  if (email !== undefined) {
    const errorEmail = validarEmail(email);
    if (errorEmail) return res.status(400).json({ error: errorEmail });
  }

  try {
    const result = await pool.query(
      'UPDATE authors SET name = COALESCE($1, name), email = COALESCE($2, email), bio = COALESCE($3, bio) WHERE id = $4 RETURNING *',
      [name, email, bio, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      error.status = 409;
      error.message = 'El email ya está registrado';
    }
    next(error);
  }
});

// DELETE /api/authors/:id - Eliminar un autor
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM authors WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Autor no encontrado' });
    }
    
    res.json({ message: 'Autor eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;