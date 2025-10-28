/**
 * Controlador para operaciones de reportes y extintores
 * Maneja CRUD y lógica de negocio para inspecciones
 * @author SAT Project Team
 */

import { Report } from '../models/Report.js';
import { Extinguisher } from '../models/Extinguisher.js';
import { formatDate } from '../lib/helpers.js';
import { validationResult } from 'express-validator';

/**
 * Controlador para reportes y extintores
 */
export const reportController = {
  // ==========================================================================
  // OPERACIONES DE REPORTES
  // ==========================================================================

  /**
   * Obtener todos los reportes del usuario autenticado
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAllReports(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      
      const reports = await Report.findByUser(req.user.id, limit, page);
      
      res.json({
        success: true,
        data: reports,
        pagination: {
          page,
          limit,
          total: await Report.countByUser(req.user.id)
        }
      });
    } catch (error) {
      console.error('Error obteniendo reportes:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo reportes'
      });
    }
  },

  /**
   * Obtener un reporte específico
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getReport(req, res) {
    try {
      const report = await Report.findById(req.params.id);
      
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Reporte no encontrado'
        });
      }

      // Verificar que el usuario sea el propietario del reporte o admin
      if (report.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para ver este reporte'
        });
      }

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Error obteniendo reporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo reporte'
      });
    }
  },

  /**
   * Crear un nuevo reporte de inspección
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async createReport(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const reportData = {
        ...req.body,
        user_id: req.user.id
      };

      const newReport = await Report.create(reportData);

      res.status(201).json({
        success: true,
        message: 'Reporte creado exitosamente',
        data: newReport
      });
    } catch (error) {
      console.error('Error creando reporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error creando reporte'
      });
    }
  },

  /**
   * Actualizar un reporte existente
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateReport(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const report = await Report.findById(req.params.id);
      
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Reporte no encontrado'
        });
      }

      // Verificar permisos
      if (report.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para editar este reporte'
        });
      }

      const updatedReport = await Report.update(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Reporte actualizado exitosamente',
        data: updatedReport
      });
    } catch (error) {
      console.error('Error actualizando reporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error actualizando reporte'
      });
    }
  },

  /**
   * Eliminar un reporte (solo administradores)
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async deleteReport(req, res) {
    try {
      const deleted = await Report.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Reporte no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Reporte eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando reporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error eliminando reporte'
      });
    }
  },

  // ==========================================================================
  // OPERACIONES DE EXTINTORES
  // ==========================================================================

  /**
   * Obtener todos los extintores
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getAllExtinguishers(req, res) {
    try {
      const extinguishers = await Extinguisher.findAll();
      
      res.json({
        success: true,
        data: extinguishers
      });
    } catch (error) {
      console.error('Error obteniendo extintores:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo extintores'
      });
    }
  },

  /**
   * Obtener un extintor específico
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getExtinguisher(req, res) {
    try {
      const extinguisher = await Extinguisher.findById(req.params.id);
      
      if (!extinguisher) {
        return res.status(404).json({
          success: false,
          message: 'Extintor no encontrado'
        });
      }

      res.json({
        success: true,
        data: extinguisher
      });
    } catch (error) {
      console.error('Error obteniendo extintor:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo extintor'
      });
    }
  },

  /**
   * Crear un nuevo extintor (solo administradores)
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async createExtinguisher(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const newExtinguisher = await Extinguisher.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Extintor creado exitosamente',
        data: newExtinguisher
      });
    } catch (error) {
      console.error('Error creando extintor:', error);
      res.status(500).json({
        success: false,
        message: 'Error creando extintor'
      });
    }
  },

  /**
   * Actualizar un extintor (solo administradores)
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async updateExtinguisher(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const updatedExtinguisher = await Extinguisher.update(req.params.id, req.body);
      
      if (!updatedExtinguisher) {
        return res.status(404).json({
          success: false,
          message: 'Extintor no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Extintor actualizado exitosamente',
        data: updatedExtinguisher
      });
    } catch (error) {
      console.error('Error actualizando extintor:', error);
      res.status(500).json({
        success: false,
        message: 'Error actualizando extintor'
      });
    }
  },

  /**
   * Eliminar un extintor (solo administradores)
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async deleteExtinguisher(req, res) {
    try {
      const deleted = await Extinguisher.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Extintor no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Extintor eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando extintor:', error);
      res.status(500).json({
        success: false,
        message: 'Error eliminando extintor'
      });
    }
  },

  // ==========================================================================
  // OPERACIONES DE ESTADÍSTICAS Y REPORTES
  // ==========================================================================

  /**
   * Obtener estadísticas generales
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getStats(req, res) {
    try {
      const [totalReports, totalExtinguishers, maintenanceDue, recentActivity] = await Promise.all([
        Report.count(),
        Extinguisher.count(),
        Extinguisher.findMaintenanceDue(),
        Report.findRecent(10)
      ]);

      res.json({
        success: true,
        data: {
          totalReports,
          totalExtinguishers,
          maintenanceDue: maintenanceDue.length,
          recentActivity
        }
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo estadísticas'
      });
    }
  },

  /**
   * Obtener reportes por fecha específica
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getReportsByDate(req, res) {
    try {
      const reports = await Report.findByDate(req.params.date);
      
      res.json({
        success: true,
        data: reports
      });
    } catch (error) {
      console.error('Error obteniendo reportes por fecha:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo reportes por fecha'
      });
    }
  },

  /**
   * Obtener extintores que requieren mantenimiento
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async getMaintenanceDue(req, res) {
    try {
      const extinguishers = await Extinguisher.findMaintenanceDue();
      
      res.json({
        success: true,
        data: extinguishers
      });
    } catch (error) {
      console.error('Error obteniendo extintores con mantenimiento debido:', error);
      res.status(500).json({
        success: false,
        message: 'Error obteniendo extintores con mantenimiento debido'
      });
    }
  }
};