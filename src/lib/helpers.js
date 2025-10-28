/**
 * Funciones auxiliares para la aplicación
 * Utilidades comunes para formateo, validación y middleware
 * @author SAT Project Team
 */

/**
 * Formatear fecha para mostrar en español
 * @param {string|Date} date - Fecha a formatear
 * @param {boolean} includeTime - Si incluir la hora
 * @returns {string} Fecha formateada
 */
export function formatDate(date, includeTime = false) {
  if (!date) return 'No especificada';
  
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Argentina/Buenos_Aires'
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    return new Intl.DateTimeFormat('es-AR', options).format(dateObj);
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Error en fecha';
  }
}

/**
 * Formatear fecha en formato corto (DD/MM/YYYY)
 * @param {string|Date} date - Fecha a formatear
 * @returns {string} Fecha en formato corto
 */
export function formatDateShort(date) {
  if (!date) return '--/--/----';
  
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }

    return dateObj.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Argentina/Buenos_Aires'
    });
  } catch (error) {
    console.error('Error formateando fecha corta:', error);
    return 'Error';
  }
}

/**
 * Calcular días desde una fecha
 * @param {string|Date} date - Fecha base
 * @returns {number} Número de días desde la fecha
 */
export function daysSince(date) {
  if (!date) return null;
  
  try {
    const dateObj = new Date(date);
    const today = new Date();
    
    const diffTime = today - dateObj;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error calculando días:', error);
    return null;
  }
}

/**
 * Calcular días hasta una fecha
 * @param {string|Date} date - Fecha objetivo
 * @returns {number} Número de días hasta la fecha (negativo si ya pasó)
 */
export function daysUntil(date) {
  if (!date) return null;
  
  try {
    const dateObj = new Date(date);
    const today = new Date();
    
    const diffTime = dateObj - today;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error calculando días hasta fecha:', error);
    return null;
  }
}

/**
 * Middleware para verificar si el usuario está autenticado
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Guardar la URL solicitada para redireccionar después del login
  req.session.returnTo = req.originalUrl;
  req.flash('error', 'Debes iniciar sesión para acceder a esta página');
  res.redirect('/auth/login');
}

/**
 * Middleware para verificar que el usuario NO esté autenticado
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export function isGuest(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  
  res.redirect('/dashboard');
}

/**
 * Middleware para verificar rol de administrador
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export function isAdmin(req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Debes iniciar sesión para acceder a esta página');
    return res.redirect('/auth/login');
  }

  if (req.user.role !== 'admin') {
    req.flash('error', 'No tienes permisos para acceder a esta página');
    return res.redirect('/dashboard');
  }

  next();
}

/**
 * Capitalizar primera letra de cada palabra
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena capitalizada
 */
export function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncar texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} length - Longitud máxima
 * @param {string} suffix - Sufijo a agregar (por defecto '...')
 * @returns {string} Texto truncado
 */
export function truncate(text, length = 100, suffix = '...') {
  if (!text || typeof text !== 'string') return '';
  
  if (text.length <= length) return text;
  
  return text.substring(0, length).trim() + suffix;
}

/**
 * Generar un slug a partir de un texto
 * @param {string} text - Texto a convertir en slug
 * @returns {string} Slug generado
 */
export function generateSlug(text) {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-'); // Reemplazar múltiples guiones con uno solo
}

/**
 * Validar si un email tiene formato válido
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido, false si no
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generar un ID único
 * @returns {string} ID único generado
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Escapar HTML para prevenir XSS
 * @param {string} unsafe - Texto no seguro
 * @returns {string} Texto escapado
 */
export function escapeHtml(unsafe) {
  if (!unsafe || typeof unsafe !== 'string') return '';
  
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formatear número con separadores de miles
 * @param {number} num - Número a formatear
 * @returns {string} Número formateado
 */
export function formatNumber(num) {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  
  return new Intl.NumberFormat('es-AR').format(num);
}

/**
 * Obtener estado de mantenimiento basado en fecha
 * @param {string|Date} nextMaintenanceDate - Fecha del próximo mantenimiento
 * @returns {Object} Objeto con estado y clase CSS
 */
export function getMaintenanceStatus(nextMaintenanceDate) {
  if (!nextMaintenanceDate) {
    return {
      status: 'Sin programar',
      class: 'warning',
      priority: 'medium'
    };
  }

  const daysUntilMaintenance = daysUntil(nextMaintenanceDate);
  
  if (daysUntilMaintenance < 0) {
    return {
      status: 'Vencido',
      class: 'danger',
      priority: 'high',
      days: Math.abs(daysUntilMaintenance)
    };
  } else if (daysUntilMaintenance <= 7) {
    return {
      status: 'Próximo',
      class: 'warning',
      priority: 'medium',
      days: daysUntilMaintenance
    };
  } else if (daysUntilMaintenance <= 30) {
    return {
      status: 'Programado',
      class: 'info',
      priority: 'low',
      days: daysUntilMaintenance
    };
  } else {
    return {
      status: 'Al día',
      class: 'success',
      priority: 'low',
      days: daysUntilMaintenance
    };
  }
}

/**
 * Obtener clase CSS para estado de reporte
 * @param {string} status - Estado del reporte
 * @returns {string} Clase CSS correspondiente
 */
export function getReportStatusClass(status) {
  const statusClasses = {
    'operativo': 'success',
    'requiere_mantenimiento': 'warning',
    'fuera_de_servicio': 'danger',
    'en_reparacion': 'info'
  };
  
  return statusClasses[status] || 'secondary';
}

/**
 * Obtener texto legible para estado de reporte
 * @param {string} status - Estado del reporte
 * @returns {string} Texto legible del estado
 */
export function getReportStatusText(status) {
  const statusTexts = {
    'operativo': 'Operativo',
    'requiere_mantenimiento': 'Requiere Mantenimiento',
    'fuera_de_servicio': 'Fuera de Servicio',
    'en_reparacion': 'En Reparación'
  };
  
  return statusTexts[status] || status;
}

/**
 * Generar mensaje de flash según el tipo
 * @param {Object} req - Request object
 * @param {string} type - Tipo de mensaje (success, error, info, warning)
 * @param {string} message - Mensaje a mostrar
 */
export function setFlashMessage(req, type, message) {
  if (!req.flash) {
    console.warn('Flash middleware no está disponible');
    return;
  }
  
  req.flash(type, message);
}

/**
 * Middleware para logging de requests
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export function logRequest(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent');
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - ${ip} - ${userAgent}`);
  
  next();
}

/**
 * Middleware de manejo de errores
 * @param {Error} err - Error object
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Si ya se envió la respuesta, delegar al manejador por defecto
  if (res.headersSent) {
    return next(err);
  }
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).render('error', {
    message: err.message || 'Error interno del servidor',
    error: isDevelopment ? err : { status: err.status || 500 },
    title: 'Error - SAT'
  });
}