const express = require('express');
const { loginAdmin } = require('../controllers/authController');

const router = express.Router();

// @route   POST api/auth/admin/login
// @desc    Autenticar administrador y obtener token
// @access  Public
router.post('/admin/login', loginAdmin);

// Aquí podrías añadir más rutas de autenticación en el futuro si es necesario
// ej. /register, /logout, /forgot-password, etc.

module.exports = router;