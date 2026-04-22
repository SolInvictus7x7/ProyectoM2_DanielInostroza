function validarEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'El email es requerido';
  }
  
  // Convertir a minúsculas y limpiar espacios
  email = email.trim().toLowerCase();
  
  // Validación básica de formato
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El formato del email es inválido';
  }
  
  // Validar longitud total
  if (email.length > 254) {
    return 'El email es demasiado largo';
  }
  
  // Separar usuario y dominio
  const [usuario, dominio] = email.split('@');
  
  // Validar parte del usuario
  if (usuario.length > 64) {
    return 'La parte local del email es demasiado larga';
  }
  
  // Validar que no empiece o termine con punto
  if (usuario.startsWith('.') || usuario.endsWith('.')) {
    return 'El email no puede comenzar o terminar con punto';
  }
  
  // Validar que no tenga puntos consecutivos
  if (usuario.includes('..')) {
    return 'El email no puede tener puntos consecutivos';
  }
  
  // Validar dominio
  if (dominio.length < 3) {
    return 'El dominio del email es demasiado corto';
  }
  
  // Verificar que el dominio tenga al menos un punto
  if (!dominio.includes('.')) {
    return 'El dominio debe contener al menos un punto';
  }
  
  return null;
}

function validarNombre(name) {
  // Verificamos si existe y si quitando espacios sigue teniendo texto
  if (!name || name.trim().length === 0) {
    return 'El nombre no puede estar vacío';
  }
  if (name.length < 3) {
    return 'El nombre debe tener al menos 3 caracteres';
  }
  return null;
}

// Validar que un campo de texto no sea solo espacios
function validarTexto(texto, nombreCampo) {
  if (!texto || typeof texto !== 'string' || texto.trim().length === 0) {
    return `El campo ${nombreCampo} no puede estar vacío`;
  }
  return null;
}

//validar author_id en routes/posts.js
function validarId(id) {
  if (!id || isNaN(id) || parseInt(id) <= 0) {
    return 'El id debe ser un número válido';
  }
  return null;
}

module.exports = {
  validarEmail,
  validarNombre,
  validarTexto,
  validarId
};