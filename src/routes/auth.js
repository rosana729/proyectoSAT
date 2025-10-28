/**
 * Rutas de autenticación
 * Maneja login, logout, registro y verificación de sesiones
 * @author SAT Project Team
 */

import express from 'express';
import { authController } from '../controllers/authController.js';
import { ensureGuest, ensureAuthenticated } from '../config/passport.js';
import { validateRegistration, validateLogin } from '../lib/validators.js';

const router = express.Router();

/**
 * Mostrar formulario de login
 * GET /auth/login
 */
router.get('/login', ensureGuest, authController.showLogin);

/**
 * Procesar login
 * POST /auth/login
 */
router.post('/login', ensureGuest, validateLogin, authController.processLogin);

/**
 * Mostrar formulario de registro
 * GET /auth/register
 */
router.get('/register', ensureGuest, authController.showRegister);

/**
 * Procesar registro
 * POST /auth/register
 */
router.post('/register', ensureGuest, validateRegistration, authController.processRegister);

/**
 * Cerrar sesión
 * POST /auth/logout
 */
router.post('/logout', ensureAuthenticated, authController.logout);

/**
 * Verificar estado de sesión (API endpoint)
 * GET /auth/status
 */
router.get('/status', authController.checkStatus);

export default router;