/**
 * Controlador principal para páginas generales
 * Maneja renderizado de páginas públicas y dashboard
 * @author SAT Project Team
 */

import { Report } from '../models/Report.js';
import { Extinguisher } from '../models/Extinguisher.js';
import { formatDate } from '../lib/helpers.js';

/**
 * Controlador para la página de inicio
 */
export const homeController = {
  /**
   * Página principal
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async index(req, res) {
    try {
      res.render('pages/home-functional', {
        title: 'SAT - Sistema de Administración de Extintores',
        user: req.user || null,
        isAuthenticated: req.isAuthenticated ? req.isAuthenticated() : false,
        appVersion: process.env.APP_VERSION || '1.0.0',
        message: req.flash('info')
      });
    } catch (error) {
      console.error('Error en página principal:', error);
      res.status(500).send(`
        <h1>Error 500</h1>
        <p>Error interno del servidor</p>
        <pre>${error.message}</pre>
        <a href="/">Volver al inicio</a>
      `);
    }
  },

  /**
   * Página de preguntas frecuentes
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async faq(req, res) {
    try {
      const faqs = [
        {
          question: '¿Cómo registro un nuevo extintor?',
          answer: 'Los administradores pueden registrar nuevos extintores desde el panel de administración. Ingresa el número de serie, tipo, ubicación y fechas de mantenimiento.'
        },
        {
          question: '¿Con qué frecuencia debo realizar inspecciones?',
          answer: 'Se recomienda realizar inspecciones visuales mensualmente y mantenimiento profesional anualmente, o según las regulaciones locales.'
        },
        {
          question: '¿Qué estados puede tener un extintor?',
          answer: 'Los extintores pueden estar en estados: Operativo, Requiere Mantenimiento, Fuera de Servicio, o En Reparación.'
        },
        {
          question: '¿Cómo genero reportes de inspección?',
          answer: 'Desde el dashboard, selecciona un extintor y completa el formulario de inspección con el estado actual y observaciones.'
        }
      ];

      res.render('pages/faq', {
        title: 'Preguntas Frecuentes - SAT',
        user: req.user || null,
        faqs
      });
    } catch (error) {
      console.error('Error en página FAQ:', error);
      res.status(500).render('error', {
        message: 'Error interno del servidor',
        error: { status: 500 }
      });
    }
  },

  /**
   * Página acerca de
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async about(req, res) {
    try {
      res.render('pages/about', {
        title: 'Acerca de SAT',
        user: req.user || null,
        version: '1.0.0',
        description: 'Sistema de Administración de Extintores desarrollado para facilitar el seguimiento y mantenimiento de equipos contra incendios.'
      });
    } catch (error) {
      console.error('Error en página acerca de:', error);
      res.status(500).render('error', {
        message: 'Error interno del servidor',
        error: { status: 500 }
      });
    }
  },

  /**
   * Dashboard principal (requiere autenticación)
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async dashboard(req, res) {
    try {
      // Obtener estadísticas del usuario
      const [recentReports, userReportsCount, totalExtinguishers, maintenanceDue] = await Promise.all([
        Report.findByUser(req.user.id, 5), // Últimos 5 reportes
        Report.countByUser(req.user.id),
        Extinguisher.count(),
        Extinguisher.findMaintenanceDue()
      ]);

      // Formatear fechas para mostrar
      const formattedReports = recentReports.map(report => ({
        ...report,
        inspection_date: formatDate(report.inspection_date),
        created_at: formatDate(report.created_at)
      }));

      res.render('pages/dashboard', {
        title: 'Dashboard - SAT',
        user: req.user,
        stats: {
          userReports: userReportsCount,
          totalExtinguishers,
          maintenanceDue: maintenanceDue.length
        },
        recentReports: formattedReports,
        maintenanceDue,
        messages: {
          success: req.flash('success'),
          error: req.flash('error'),
          info: req.flash('info')
        }
      });
    } catch (error) {
      console.error('Error en dashboard:', error);
      res.status(500).render('error', {
        message: 'Error cargando el dashboard',
        error: { status: 500 }
      });
    }
  },

  /**
   * Página de perfil de usuario
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async profile(req, res) {
    try {
      // Obtener estadísticas del usuario
      const userStats = await Report.getUserStats(req.user.id);

      res.render('pages/profile', {
        title: 'Mi Perfil - SAT',
        user: req.user,
        stats: userStats,
        messages: {
          success: req.flash('success'),
          error: req.flash('error'),
          info: req.flash('info')
        }
      });
    } catch (error) {
      console.error('Error en perfil:', error);
      res.status(500).render('error', {
        message: 'Error cargando el perfil',
        error: { status: 500 }
      });
    }
  }
};