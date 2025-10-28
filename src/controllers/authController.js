/**
 * Controlador de autenticación
 * Maneja login, registro, logout y verificación de sesiones
 * @author SAT Project Team
 */

import passport from 'passport';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { config } from '../config/keys.js';
import { validationResult } from 'express-validator';

/**
 * Controlador para autenticación
 */
export const authController = {
  /**
   * Mostrar formulario de login
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  showLogin(req, res) {
    try {
      res.render('auth/login', {
        title: 'Iniciar Sesión - SAT',
        messages: {
          error: req.flash('error'),
          success: req.flash('success'),
          info: req.flash('info')
        }
      });
    } catch (error) {
      console.error('Error mostrando login:', error);
      res.status(500).render('error', {
        message: 'Error interno del servidor',
        error: { status: 500 }
      });
    }
  },

  /**
   * Procesar login del usuario
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware function
   */
  processLogin(req, res, next) {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error', 'Por favor, corrige los errores en el formulario');
      return res.redirect('/auth/login');
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error('Error en autenticación:', err);
        req.flash('error', 'Error interno del servidor');
        return res.redirect('/auth/login');
      }

      if (!user) {
        req.flash('error', info.message || 'Credenciales inválidas');
        return res.redirect('/auth/login');
      }

      req.logIn(user, (err) => {
        if (err) {
          console.error('Error iniciando sesión:', err);
          req.flash('error', 'Error iniciando sesión');
          return res.redirect('/auth/login');
        }

        // Redireccionar a la página solicitada originalmente o al dashboard
        const returnTo = req.session.returnTo || '/dashboard';
        delete req.session.returnTo;
        
        req.flash('success', `¡Bienvenido, ${user.full_name}!`);
        res.redirect(returnTo);
      });
    })(req, res, next);
  },

  /**
   * Mostrar formulario de registro
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  showRegister(req, res) {
    try {
      res.render('auth/register', {
        title: 'Registrarse - SAT',
        messages: {
          error: req.flash('error'),
          success: req.flash('success'),
          info: req.flash('info')
        }
      });
    } catch (error) {
      console.error('Error mostrando registro:', error);
      res.status(500).render('error', {
        message: 'Error interno del servidor',
        error: { status: 500 }
      });
    }
  },

  /**
   * Procesar registro de nuevo usuario
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async processRegister(req, res) {
    try {
      // Verificar errores de validación
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        req.flash('error', errorMessages.join('. '));
        return res.redirect('/auth/register');
      }

      const { email, password, full_name } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        req.flash('error', 'El email ya está registrado');
        return res.redirect('/auth/register');
      }

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, config.bcrypt.rounds);

      // Crear nuevo usuario
      const userData = {
        email,
        password: hashedPassword,
        full_name,
        role: 'user' // Por defecto, los nuevos usuarios son 'user'
      };

      const newUser = await User.create(userData);

      if (!newUser) {
        req.flash('error', 'Error creando la cuenta. Intenta nuevamente.');
        return res.redirect('/auth/register');
      }

      // Auto-login después del registro
      req.logIn(newUser, (err) => {
        if (err) {
          console.error('Error auto-login después de registro:', err);
          req.flash('success', 'Cuenta creada exitosamente. Por favor, inicia sesión.');
          return res.redirect('/auth/login');
        }

        req.flash('success', `¡Cuenta creada exitosamente! Bienvenido, ${newUser.full_name}!`);
        res.redirect('/dashboard');
      });

    } catch (error) {
      console.error('Error en registro:', error);
      req.flash('error', 'Error interno del servidor. Intenta nuevamente.');
      res.redirect('/auth/register');
    }
  },

  /**
   * Cerrar sesión del usuario
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  logout(req, res) {
    try {
      const userName = req.user ? req.user.full_name : 'Usuario';
      
      req.logout((err) => {
        if (err) {
          console.error('Error cerrando sesión:', err);
          req.flash('error', 'Error cerrando sesión');
          return res.redirect('/dashboard');
        }

        req.session.destroy((err) => {
          if (err) {
            console.error('Error destruyendo sesión:', err);
          }
          
          res.clearCookie('connect.sid'); // Limpiar cookie de sesión
          req.flash('success', `¡Hasta luego, ${userName}!`);
          res.redirect('/');
        });
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.redirect('/');
    }
  },

  /**
   * Verificar estado de sesión (endpoint API)
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  checkStatus(req, res) {
    try {
      if (req.isAuthenticated()) {
        const { password, ...userWithoutPassword } = req.user;
        res.json({
          authenticated: true,
          user: userWithoutPassword
        });
      } else {
        res.json({
          authenticated: false,
          user: null
        });
      }
    } catch (error) {
      console.error('Error verificando estado de sesión:', error);
      res.status(500).json({
        authenticated: false,
        error: 'Error interno del servidor'
      });
    }
  }
};