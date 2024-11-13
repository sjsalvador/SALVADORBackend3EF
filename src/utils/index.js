// src/utils/index.js
const bcrypt = require('bcrypt');

// Función para hashear contraseñas
const createHash = async (password) => {
  const salts = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salts);
};

// Validación de contraseñas
const passwordValidation = async (user, password) => bcrypt.compare(password, user.password);

module.exports = {
  createHash,
  passwordValidation,
};