/**
 * Configuración de claves y variables de entorno
 * Centraliza el acceso a todas las variables de configuración
 * @author SAT Project Team
 */

import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

/**
 * Objeto de configuración principal
 * Exporta todas las claves necesarias para la aplicación
 */
export const config = {
  // ============================================================================
  // CONFIGURACIÓN DEL SERVIDOR
  // ============================================================================
  port: parseInt(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  baseUrl: process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : process.env.BASE_URL || 'http://localhost:3000',
  appVersion: process.env.APP_VERSION || '1.0.0',
  isVercel: process.env.VERCEL === '1',

  // ============================================================================
  // CONFIGURACIÓN DE SUPABASE
  // ============================================================================
  supabase: {
    url: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'your-anon-key',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'
  },

  // ============================================================================
  // CONFIGURACIÓN DE SESIONES Y AUTENTICACIÓN
  // ============================================================================
  session: {
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    name: process.env.SESSION_NAME || 'sat-session',
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000, // 24 horas
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    rolling: true, // Renovar sesión en cada request
    resave: false,
    saveUninitialized: false
  },

  // Configuración de encriptación
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS) || 12
  },

  // ============================================================================
  // CONFIGURACIÓN DE BASE DE DATOS
  // ============================================================================
  database: {
    mode: process.env.DATABASE_MODE || 'development',
    schema: process.env.DATABASE_SCHEMA || 'public',
    timeout: parseInt(process.env.DATABASE_TIMEOUT) || 30000,
    ssl: process.env.DATABASE_SSL === 'true' || true,
    connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT) || 20,
    pool: {
      min: parseInt(process.env.DB_POOL_MIN) || 2,
      max: parseInt(process.env.DB_POOL_MAX) || 10
    },
    migrations: {
      table: process.env.DATABASE_MIGRATIONS_TABLE || 'migrations',
      autoMigrate: process.env.DATABASE_AUTO_MIGRATE === 'true' || false
    },
    seeds: {
      enabled: process.env.DATABASE_SEEDS_ENABLED === 'true' || false
    },
    cache: {
      enabled: process.env.DATABASE_CACHE_ENABLED === 'true' || true,
      ttl: parseInt(process.env.DATABASE_CACHE_TTL) || 300
    }
  },

  // ============================================================================
  // CONFIGURACIÓN DE ARCHIVOS Y UPLOADS
  // ============================================================================
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg', 'image/png', 'image/gif', 'application/pdf'
    ],
    directory: process.env.UPLOAD_DIR || './uploads',
    tempDirectory: path.join(process.env.UPLOAD_DIR || './uploads', 'temp')
  },

  // ============================================================================
  // CONFIGURACIÓN DE EMAIL
  // ============================================================================
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    },
    from: {
      email: process.env.FROM_EMAIL || 'noreply@sat-sistema.com',
      name: process.env.FROM_NAME || 'Sistema SAT'
    }
  },

  // ============================================================================
  // CONFIGURACIÓN DE LOGS
  // ============================================================================
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    directory: process.env.LOG_DIR || './logs',
    maxFiles: 30, // Mantener logs por 30 días
    maxSize: '20m' // Máximo 20MB por archivo
  },

  // ============================================================================
  // CONFIGURACIÓN DE SEGURIDAD
  // ============================================================================
  security: {
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
    },
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: process.env.CORS_CREDENTIALS === 'true' || true
    },
    helmet: {
      contentSecurityPolicy: process.env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false
    }
  },

  // ============================================================================
  // CONFIGURACIÓN DE FUNCIONALIDADES
  // ============================================================================
  features: {
    userRegistration: process.env.ENABLE_USER_REGISTRATION === 'true' || true,
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true' || false,
    demoMode: process.env.DEMO_MODE === 'true' || false
  },

  // ============================================================================
  // CONFIGURACIÓN DE DESARROLLO
  // ============================================================================
  development: {
    showDetailedErrors: process.env.SHOW_DETAILED_ERRORS === 'true' || false,
    enableHotReload: process.env.ENABLE_HOT_RELOAD === 'true' || false
  },

  // ============================================================================
  // CONFIGURACIÓN DE NODE.JS Y PERFORMANCE
  // ============================================================================
  node: {
    options: process.env.NODE_OPTIONS || '--max-old-space-size=4096',
    path: process.env.NODE_PATH || './node_modules',
    memoryLimit: process.env.MEMORY_LIMIT || '512mb',
    heapSizeLimit: process.env.HEAP_SIZE_LIMIT || '1024mb'
  },

  npm: {
    cache: process.env.NPM_CONFIG_CACHE || './.npm-cache',
    progress: process.env.NPM_CONFIG_PROGRESS === 'true' || true,
    logLevel: process.env.NPM_CONFIG_LOGLEVEL || 'warn'
  },

  // ============================================================================
  // CONFIGURACIÓN DE PATHS Y DIRECTORIOS
  // ============================================================================
  paths: {
    root: process.env.ROOT_DIR || './',
    src: process.env.SRC_DIR || './src',
    public: process.env.PUBLIC_DIR || './public',
    views: process.env.VIEWS_DIR || './src/views',
    static: process.env.STATIC_DIR || './public',
    uploads: process.env.UPLOADS_DIR || './uploads',
    temp: process.env.TEMP_DIR || './temp',
    cache: process.env.CACHE_DIR || './.cache',
    nodeModules: process.env.NODE_MODULES_DIR || './node_modules',
    nodeModulesCache: process.env.NODE_MODULES_CACHE || './.npm-cache'
  },

  // ============================================================================
  // CONFIGURACIÓN DE CACHE Y PERFORMANCE
  // ============================================================================
  cache: {
    app: {
      enabled: process.env.APP_CACHE_ENABLED === 'true' || true,
      ttl: parseInt(process.env.APP_CACHE_TTL) || 3600
    },
    static: {
      ttl: parseInt(process.env.STATIC_CACHE_TTL) || 86400
    }
  },

  cluster: {
    enabled: process.env.CLUSTER_MODE === 'true' || false,
    workers: parseInt(process.env.WORKER_PROCESSES) || 1
  }
};

/**
 * Validar que todas las variables críticas estén configuradas
 * Lanzar error si faltan variables esenciales
 */
export function validateConfig() {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SESSION_SECRET'
  ];

  const missing = required.filter(key => !process.env[key] || process.env[key].includes('your_'));
  
  if (missing.length > 0) {
    console.error('❌ Error de configuración:');
    console.error(`Faltan las siguientes variables de entorno: ${missing.join(', ')}`);
    console.error('Copia .env.example a .env y completa los valores reales.');
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Variables de entorno faltantes: ${missing.join(', ')}`);
    } else {
      console.warn('⚠️  Usando valores por defecto para desarrollo.');
    }
  } else {
    console.log('✅ Configuración validada correctamente');
  }

  // Validaciones adicionales
  if (config.nodeEnv === 'production') {
    validateProductionConfig();
  }

  return true;
}

/**
 * Validaciones específicas para entorno de producción
 */
function validateProductionConfig() {
  const productionChecks = [
    {
      condition: config.session.secret === 'your-secret-key-change-in-production',
      message: 'SESSION_SECRET debe cambiarse en producción'
    },
    {
      condition: !config.supabase.serviceRoleKey || config.supabase.serviceRoleKey.includes('your_'),
      message: 'SUPABASE_SERVICE_ROLE_KEY es requerida en producción'
    },
    {
      condition: config.baseUrl.includes('localhost'),
      message: 'BASE_URL debe configurarse con el dominio de producción'
    }
  ];

  const productionErrors = productionChecks
    .filter(check => check.condition)
    .map(check => check.message);

  if (productionErrors.length > 0) {
    console.error('❌ Errores de configuración para producción:');
    productionErrors.forEach(error => console.error(`- ${error}`));
    throw new Error('Configuración inválida para producción');
  }
}

/**
 * Obtener configuración específica del entorno
 */
export function getEnvironmentConfig() {
  const isProduction = config.nodeEnv === 'production';
  const isDevelopment = config.nodeEnv === 'development';
  const isTest = config.nodeEnv === 'test';

  return {
    isProduction,
    isDevelopment,
    isTest,
    // Configuración específica del entorno
    supabaseKey: isProduction ? config.supabase.serviceRoleKey : config.supabase.anonKey,
    logLevel: isProduction ? 'warn' : 'debug',
    showErrors: isDevelopment || config.development.showDetailedErrors
  };
}

export default config;