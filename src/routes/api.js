const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

// Listar reportes
router.get('/reports', reportsController.listReports);
// Crear reporte
router.post('/reports', reportsController.createReport);
// Actualizar reporte
router.put('/reports/:id', reportsController.updateReport);

module.exports = router;
