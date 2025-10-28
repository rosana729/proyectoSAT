/**
 * Rutas principales de la aplicación
 * Maneja las páginas públicas y dashboard
 * @author SAT Project Team
 */

import express from 'express';
import { homeController } from '../controllers/homeController.js';
import { ensureAuthenticated } from '../config/passport.js';

const router = express.Router();

/**
 * Ruta principal - Página de inicio
 * GET /
 */
router.get('/', homeController.index);

/**
 * Página de preguntas frecuentes
 * GET /faq
 */
router.get('/faq', homeController.faq);

/**
 * Página acerca de
 * GET /about
 */
router.get('/about', homeController.about);

/**
 * Dashboard principal (requiere autenticación)
 * GET /dashboard
 */
router.get('/dashboard', ensureAuthenticated, homeController.dashboard);

/**
 * Página de perfil de usuario (requiere autenticación)
 * GET /profile
 */
router.get('/profile', ensureAuthenticated, homeController.profile);

export default router;