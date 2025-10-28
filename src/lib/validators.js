/**
 * Validadores de entrada usando express-validator
 * Define reglas de validación para formularios y API endpoints
 * @author SAT Project Team
 */

import { body, param, query } from 'express-validator';

/**
 * Validaciones para registro de usuario
 */
export const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('El email es demasiado largo'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una minúscula, una mayúscula y un número'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    }),

  body('full_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios')
];

/**
 * Validaciones para login de usuario
 */
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

/**
 * Validaciones para creación/edición de reporte
 */
export const validateReport = [
  body('extinguisher_id')
    .isUUID()
    .withMessage('ID de extintor inválido'),

  body('inspection_date')
    .isISO8601()
    .withMessage('Fecha de inspección inválida')
    .custom((value) => {
      const inspectionDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Permitir hasta el final del día actual
      
      if (inspectionDate > today) {
        throw new Error('La fecha de inspección no puede ser futura');
      }
      return true;
    }),

  body('status')
    .isIn(['operativo', 'requiere_mantenimiento', 'fuera_de_servicio', 'en_reparacion'])
    .withMessage('Estado del extintor inválido'),

  body('observations')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Las observaciones no pueden exceder 1000 caracteres'),

  body('pressure_level')
    .optional()
    .isIn(['normal', 'baja', 'alta', 'sin_presion'])
    .withMessage('Nivel de presión inválido'),

  body('external_condition')
    .optional()
    .isIn(['buena', 'regular', 'mala'])
    .withMessage('Condición externa inválida'),

  body('seal_condition')
    .optional()
    .isIn(['intacto', 'dañado', 'faltante'])
    .withMessage('Condición del sello inválida'),

  body('location_accessible')
    .optional()
    .isBoolean()
    .withMessage('Accesibilidad de ubicación debe ser verdadero o falso')
];

/**
 * Validaciones para creación/edición de extintor
 */
export const validateExtinguisher = [
  body('serial_number')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('El número de serie debe tener entre 3 y 50 caracteres')
    .matches(/^[A-Z0-9\-]+$/i)
    .withMessage('El número de serie solo puede contener letras, números y guiones'),

  body('type')
    .isIn(['abc', 'co2', 'espuma', 'polvo_quimico', 'agua', 'halon'])
    .withMessage('Tipo de extintor inválido'),

  body('location')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('La ubicación debe tener entre 3 y 200 caracteres'),

  body('capacity')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('La capacidad no puede exceder 20 caracteres'),

  body('manufacture_date')
    .optional()
    .isISO8601()
    .withMessage('Fecha de fabricación inválida')
    .custom((value) => {
      if (value) {
        const manufactureDate = new Date(value);
        const today = new Date();
        
        if (manufactureDate > today) {
          throw new Error('La fecha de fabricación no puede ser futura');
        }
      }
      return true;
    }),

  body('last_maintenance')
    .optional()
    .isISO8601()
    .withMessage('Fecha de último mantenimiento inválida')
    .custom((value) => {
      if (value) {
        const maintenanceDate = new Date(value);
        const today = new Date();
        
        if (maintenanceDate > today) {
          throw new Error('La fecha de mantenimiento no puede ser futura');
        }
      }
      return true;
    }),

  body('next_maintenance')
    .optional()
    .isISO8601()
    .withMessage('Fecha de próximo mantenimiento inválida'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance', 'retired'])
    .withMessage('Estado del extintor inválido'),

  body('building')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El edificio no puede exceder 100 caracteres'),

  body('floor')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('El piso no puede exceder 20 caracteres'),

  body('zone')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('La zona no puede exceder 50 caracteres')
];

/**
 * Validaciones para actualización de perfil de usuario
 */
export const validateProfile = [
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),

  body('email')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('El email es demasiado largo')
];

/**
 * Validaciones para cambio de contraseña
 */
export const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('La contraseña actual es requerida'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('La nueva contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La nueva contraseña debe contener al menos una minúscula, una mayúscula y un número'),

  body('confirmNewPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Las contraseñas nuevas no coinciden');
      }
      return true;
    })
];

/**
 * Validaciones para parámetros de URL
 */
export const validateId = [
  param('id')
    .isUUID()
    .withMessage('ID inválido')
];

/**
 * Validaciones para parámetros de fecha
 */
export const validateDate = [
  param('date')
    .isISO8601()
    .withMessage('Formato de fecha inválido')
];

/**
 * Validaciones para query parameters de paginación
 */
export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100')
];

/**
 * Validaciones para filtros de búsqueda
 */
export const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El término de búsqueda debe tener entre 1 y 100 caracteres'),

  query('type')
    .optional()
    .isIn(['abc', 'co2', 'espuma', 'polvo_quimico', 'agua', 'halon'])
    .withMessage('Tipo de extintor inválido'),

  query('status')
    .optional()
    .isIn(['active', 'inactive', 'maintenance', 'retired'])
    .withMessage('Estado inválido'),

  query('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La ubicación no puede exceder 200 caracteres')
];

/**
 * Validaciones para filtros de fecha
 */
export const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de inicio inválida'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Fecha de fin inválida')
    .custom((value, { req }) => {
      if (value && req.query.startDate) {
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(value);
        
        if (endDate < startDate) {
          throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }
      return true;
    })
];

/**
 * Validador personalizado para números de serie únicos
 * @param {string} serialNumber - Número de serie a validar
 * @param {string} excludeId - ID a excluir de la búsqueda
 * @returns {Promise<boolean>} true si es único, error si no
 */
export const validateUniqueSerialNumber = (excludeId = null) => {
  return body('serial_number').custom(async (value) => {
    // Esta validación se debe implementar en el controlador
    // ya que necesita acceso a la base de datos
    return true;
  });
};

/**
 * Validador personalizado para emails únicos
 * @param {string} excludeId - ID a excluir de la búsqueda
 * @returns {Promise<boolean>} true si es único, error si no
 */
export const validateUniqueEmail = (excludeId = null) => {
  return body('email').custom(async (value) => {
    // Esta validación se debe implementar en el controlador
    // ya que necesita acceso a la base de datos
    return true;
  });
};

/**
 * Mensajes de error personalizados en español
 */
export const errorMessages = {
  required: 'Este campo es requerido',
  email: 'Debe ser un email válido',
  minLength: (min) => `Debe tener al menos ${min} caracteres`,
  maxLength: (max) => `No puede exceder ${max} caracteres`,
  alphaNumeric: 'Solo puede contener letras y números',
  numeric: 'Solo puede contener números',
  alpha: 'Solo puede contener letras',
  url: 'Debe ser una URL válida',
  phone: 'Debe ser un número de teléfono válido',
  date: 'Debe ser una fecha válida',
  password: 'La contraseña debe contener al menos una minúscula, una mayúscula y un número'
};