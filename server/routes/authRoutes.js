import express from 'express';
import { loginAdmin } from '../controllers/authController.js'; // Asegúrate que authController.js también use exportaciones ES6 y tenga la extensión .js

const router = express.Router();
// @route   POST api/auth/admin/login
// @desc    Autenticar administrador y obtener token
// @access  Public
router.post('/admin/login', loginAdmin);
// Aquí podrías añadir más rutas de autenticación en el futuro si es necesario
// ej. /register, /logout, /forgot-password, etc.

export default router; 