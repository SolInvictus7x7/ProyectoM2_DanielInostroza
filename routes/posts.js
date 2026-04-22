const { loadEnvFile } = require('node:process');
loadEnvFile('.env');
const express = require('express');
const router = express.Router();
const pool = require('../db/config');
const { validarTexto, validarId } = require('../src/validators.js');

// GET /api/posts - Obtener todos los posts
router.get('/', async (req, res) => {
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
    console.error('Error obteniendo posts:', error);
    res.status(500).json({ error: 'Error obteniendo posts' });
  }
});

// GET /api/posts/:id - Obtener un post por ID
router.get('/:id', async (req, res) => {
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
    console.error('Error obteniendo post:', error);
    res.status(500).json({ error: 'Error obteniendo post' });
  }
});

// GET /api/posts/author/:authorId - Obtener posts por autor
router.get('/author/:authorId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC',
      [req.params.authorId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo posts del autor:', error);
    res.status(500).json({ error: 'Error obteniendo posts del autor' });
  }
});

// POST /api/posts - Crear un nuevo post
router.post('/', async (req, res) => {
  const { title, content, author_id, published } = req.body;

  // 1. Validar Título
  const errorTitle = validarTexto(title, 'título');
  if (errorTitle) return res.status(errorTitle.status).json({ error: errorTitle.message });

  // 2. Validar Contenido
  const errorContent = validarTexto(content, 'contenido');
  if (errorContent) return res.status(errorContent.status).json({ error: errorContent.message });

  // 3. Validar Author_id (formato)
  const errorId = validarId(author_id);
  if (errorId) return res.status(errorId.status).json({ error: errorId.message });

  try {
    const result = await pool.query(
      'INSERT INTO posts (title, content, author_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, author_id, published || false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando post:', error);
    
    if (error.code === '23503') {
      return res.status(404).json({ error: 'El autor especificado no existe' });
    }
    
    res.status(500).json({ error: 'Error creando post' });
  }
});

// PUT /api/posts/:id - Actualizar un post
router.put('/:id', async (req, res) => {
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
    res.status(500).json({ error: 'Error actualizando post' });
  }
});

// DELETE /api/posts/:id - Eliminar un post
router.delete('/:id', async (req, res) => {
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
    console.error('Error eliminando post:', error);
    res.status(500).json({ error: 'Error eliminando post' });
  }
});

module.exports = router;