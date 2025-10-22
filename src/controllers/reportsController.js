// Controlador para reports con validación básica
const reportsModel = require('../models/reports');

const handleError = (err, next) => {
  // mapear errores del mock
  let error = err;
  if (err && err.code === 'NOT_FOUND') {
    error = new Error('Reporte no encontrado');
    error.status = 404;
  }
  error.ok = false;
  return next(error);
};

exports.listReports = async (req, res, next) => {
  try {
    const reports = await reportsModel.list();
    res.json({ ok: true, data: reports });
  } catch (err) {
    handleError(err, next);
  }
};

exports.createReport = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    if (!title || !description) {
      const e = new Error('Los campos title y description son obligatorios');
      e.status = 400;
      return next(e);
    }

    const report = await reportsModel.create({ title, description, status: status || 'pending' });
    res.status(201).json({ ok: true, data: report });
  } catch (err) {
    handleError(err, next);
  }
};

exports.updateReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const report = await reportsModel.update(id, updates);
    res.json({ ok: true, data: report });
  } catch (err) {
    handleError(err, next);
  }
};
