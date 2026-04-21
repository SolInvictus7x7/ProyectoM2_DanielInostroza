export function validarEmail(email) {
  if (!email) {
    return 'El email es requerido';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El formato del email es inválido';
  }
  return null; // null significa que la validación pasó
}

export function validarEdad(edad) {
  if (edad === undefined) return null; // Campo opcional
  
  if (typeof edad !== 'number' || isNaN(edad)) {
    return 'La edad debe ser un número';
  }
  
  if (edad < 0 || edad > 150) {
    return 'La edad debe estar entre 0 y 150';
  }
  
  return null;
}