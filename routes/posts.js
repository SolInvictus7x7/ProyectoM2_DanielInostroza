const { loadEnvFile } = require('node:process');
loadEnvFile('.env');
const express = require('express');
const router = express.Router();
const pool = require('../db/config');
const { validarTexto, validarId } = require('../src/validators.js');

// GET /api/posts - Obtener todos los posts
router.get('/', async (req, res, next) => {
  const { published } = req.query;
  
  try {
    let query = 'SELECT * FROM posts';
    let params = [];
    
    if (published !== undefined) {
      query += ' WHERE published = $1';
      params.push(published === 'true');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/:id - Obtener un post por ID
router.get('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// GET /api/posts/author/:authorId - Obtener posts por autor
router.get('/author/:authorId', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC',
      [req.params.authorId]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/posts - Crear un nuevo post
router.post('/', async (req, res, next) => {
  const { title, content, author_id, published } = req.body;

  // 1. Validar Título
  const errorTitle = validarTexto(title, 'título');
  if (errorTitle) return res.status(400).json({ error: errorTitle });

  // 2. Validar Contenido
  const errorContent = validarTexto(content, 'contenido');
  if (errorContent) return res.status(400).json({ error: errorContent });

  // 3. Validar Author_id (formato)
  const errorId = validarId(author_id);
  if (errorId) return res.status(400).json({ error: errorId });

  try {
    const result = await pool.query(
      'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, author_id, published || false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23503') {
      error.status = 404;
      error.message = 'El autor especificado no existe';
    }
    next(error);
  }
});

// PUT /api/posts/:id - Actualizar un post
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { title, content, published } = req.body;

  // 1. Validar ID de la URL
  const errorId = validarId(id);
  if (errorId) return res.status(400).json({ error: errorId });

  // 2. Validar texto solo si se intenta actualizar
  if (title !== undefined) {
    const errorTitle = validarTexto(title, 'título');
    if (errorTitle) return res.status(400).json({ error: errorTitle });
  }

  if (content !== undefined) {
    const errorContent = validarTexto(content, 'contenido');
    if (errorContent) return res.status(400).json({ error: errorContent });
  }

  try {
    const result = await pool.query(
      'UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content), published = COALESCE($3, published) WHERE id = $4 RETURNING *',
      [title, content, published, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/posts/:id - Eliminar un post
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    
    res.json({ message: 'Post eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;