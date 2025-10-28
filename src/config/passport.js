/**
 * Configuración de Passport.js para autenticación
 * Implementa estrategia local con Supabase como backend
 * @author SAT Project Team
 */

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

/**
 * Configuración de la estrategia local de Passport
 * Autenticación por email y contraseña
 */
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Buscar usuario por email
    const user = await User.findByEmail(email);
    
    if (!user) {
      return done(null, false, { 
        message: 'El email no está registrado' 
      });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return done(null, false, { 
        message: 'Contraseña incorrecta' 
      });
    }

    // Autenticación exitosa
    return done(null, user);

  } catch (error) {
    console.error('Error en autenticación:', error);
    return done(error, false, { 
      message: 'Error interno del servidor' 
    });
  }
}));

/**
 * Serialización del usuario para la sesión
 * Guarda solo el ID del usuario en la sesión
 */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/**
 * Deserialización del usuario desde la sesión
 * Recupera el usuario completo usando el ID guardado
 */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    
    if (!user) {
      return done(null, false);
    }

    // Remover la contraseña del objeto usuario por seguridad
    const { password, ...userWithoutPassword } = user;
    done(null, userWithoutPassword);

  } catch (error) {
    console.error('Error deserializando usuario:', error);
    done(error, null);
  }
});

/**
 * Middleware para verificar si el usuario está autenticado
 * @param {Object} req - Request object
 * @param {Object} res - Response object  
 * @param {Function} next - Next middleware function
 */
export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Guardar la URL solicitada para redireccionar después del login
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth/login');
}

/**
 * Middleware para verificar si el usuario NO está autenticado
 * Útil para páginas como login/register que solo deben acceder usuarios no logueados
 * @param {Object} req - Request object
 * @param {Object} res - Response object  
 * @param {Function} next - Next middleware function
 */
export function ensureGuest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  
  res.redirect('/dashboard');
}

/**
 * Middleware para verificar roles de usuario
 * @param {Array} allowedRoles - Array de roles permitidos
 * @returns {Function} Middleware function
 */
export function ensureRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/auth/login');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).render('error', {
        message: 'No tienes permisos para acceder a esta página',
        error: { status: 403 }
      });
    }

    next();
  };
}

export default passport;