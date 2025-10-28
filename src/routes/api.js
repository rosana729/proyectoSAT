/**
 * Rutas de API REST
 * Endpoints para operaciones CRUD de reportes y extintores
 * @author SAT Project Team
 */

import express from 'express';
import { reportController } from '../controllers/reportController.js';
import { ensureAuthenticated, ensureRole } from '../config/passport.js';
import { validateReport, validateExtinguisher } from '../lib/validators.js';

const router = express.Router();

// =============================================================================
// RUTAS DE REPORTES
// =============================================================================

/**
 * Obtener todos los reportes
 * GET /api/reports
 */
router.get('/reports', ensureAuthenticated, reportController.getAllReports);

/**
 * Obtener un reporte específico
 * GET /api/reports/:id
 */
router.get('/reports/:id', ensureAuthenticated, reportController.getReport);

/**
 * Crear un nuevo reporte
 * POST /api/reports
 */
router.post('/reports', ensureAuthenticated, validateReport, reportController.createReport);

/**
 * Actualizar un reporte
 * PUT /api/reports/:id
 */
router.put('/reports/:id', ensureAuthenticated, validateReport, reportController.updateReport);

/**
 * Eliminar un reporte (solo administradores)
 * DELETE /api/reports/:id
 */
router.delete('/reports/:id', ensureAuthenticated, ensureRole(['admin']), reportController.deleteReport);

// =============================================================================
// RUTAS DE EXTINTORES
// =============================================================================

/**
 * Obtener todos los extintores
 * GET /api/extinguishers
 */
router.get('/extinguishers', ensureAuthenticated, reportController.getAllExtinguishers);

/**
 * Obtener un extintor específico
 * GET /api/extinguishers/:id
 */
router.get('/extinguishers/:id', ensureAuthenticated, reportController.getExtinguisher);

/**
 * Crear un nuevo extintor (solo administradores)
 * POST /api/extinguishers
 */
router.post('/extinguishers', ensureAuthenticated, ensureRole(['admin']), validateExtinguisher, reportController.createExtinguisher);

/**
 * Actualizar un extintor (solo administradores)
 * PUT /api/extinguishers/:id
 */
router.put('/extinguishers/:id', ensureAuthenticated, ensureRole(['admin']), validateExtinguisher, reportController.updateExtinguisher);

/**
 * Eliminar un extintor (solo administradores)
 * DELETE /api/extinguishers/:id
 */
router.delete('/extinguishers/:id', ensureAuthenticated, ensureRole(['admin']), reportController.deleteExtinguisher);

// =============================================================================
// RUTAS DE ESTADÍSTICAS Y REPORTES
// =============================================================================

/**
 * Obtener estadísticas generales
 * GET /api/stats
 */
router.get('/stats', ensureAuthenticated, reportController.getStats);

/**
 * Obtener reportes por fecha
 * GET /api/reports/date/:date
 */
router.get('/reports/date/:date', ensureAuthenticated, reportController.getReportsByDate);

/**
 * Obtener extintores que requieren mantenimiento
 * GET /api/extinguishers/maintenance-due
 */
router.get('/extinguishers/maintenance-due', ensureAuthenticated, reportController.getMaintenanceDue);

export default router;