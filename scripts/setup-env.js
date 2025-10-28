#!/usr/bin/env node

/**
 * Script de configuración inicial para SAT Project
 * Ayuda a configurar el entorno de desarrollo
 * @author SAT Project Team
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para preguntar al usuario
function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Función para mostrar mensajes con colores
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Generar clave secreta aleatoria
function generateSecretKey() {
  return crypto.randomBytes(64).toString('hex');
}

// Validar URL de Supabase
function isValidSupabaseUrl(url) {
  return url && url.includes('supabase.co') && url.startsWith('https://');
}

// Validar clave de Supabase
function isValidSupabaseKey(key) {
  return key && key.startsWith('eyJ') && key.length > 100;
}

async function main() {
  log('\n🚀 Configuración Inicial de SAT Project', 'bright');
  log('=========================================\n', 'cyan');

  // Verificar si ya existe .env
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    log('⚠️  Ya existe un archivo .env', 'yellow');
    const overwrite = await ask('¿Deseas sobrescribirlo? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      log('Configuración cancelada.', 'yellow');
      process.exit(0);
    }
  }

  log('Vamos a configurar tu entorno de desarrollo.\n', 'green');

  // Recopilar información básica
  log('📋 Configuración Básica', 'bright');
  log('----------------------\n', 'cyan');

  const port = await ask('Puerto del servidor (3000): ') || '3000';
  const nodeEnv = await ask('Entorno (development/production) [development]: ') || 'development';
  
  // Configuración de Supabase
  log('\n🗄️  Configuración de Supabase', 'bright');
  log('------------------------------\n', 'cyan');
  
  log('Necesitas las credenciales de tu proyecto Supabase:', 'blue');
  log('1. Ve a https://supabase.com/dashboard', 'dim');
  log('2. Selecciona tu proyecto', 'dim');
  log('3. Ve a Settings > API\n', 'dim');

  let supabaseUrl = '';
  while (!isValidSupabaseUrl(supabaseUrl)) {
    supabaseUrl = await ask('URL del proyecto Supabase: ');
    if (!isValidSupabaseUrl(supabaseUrl)) {
      log('❌ URL inválida. Debe ser una URL de Supabase (https://xxx.supabase.co)', 'red');
    }
  }

  let anonKey = '';
  while (!isValidSupabaseKey(anonKey)) {
    anonKey = await ask('Clave anónima (anon public): ');
    if (!isValidSupabaseKey(anonKey)) {
      log('❌ Clave inválida. Debe comenzar con "eyJ" y ser larga', 'red');
    }
  }

  let serviceRoleKey = '';
  if (nodeEnv === 'production') {
    while (!isValidSupabaseKey(serviceRoleKey)) {
      serviceRoleKey = await ask('Clave de rol de servicio (service_role): ');
      if (!isValidSupabaseKey(serviceRoleKey)) {
        log('❌ Clave inválida. Debe comenzar con "eyJ" y ser larga', 'red');
      }
    }
  } else {
    const wantServiceRole = await ask('¿Configurar clave de rol de servicio? (y/N): ');
    if (wantServiceRole.toLowerCase() === 'y' || wantServiceRole.toLowerCase() === 'yes') {
      serviceRoleKey = await ask('Clave de rol de servicio (service_role): ');
    }
  }

  // Configuración de seguridad
  log('\n🔐 Configuración de Seguridad', 'bright');
  log('------------------------------\n', 'cyan');

  const autoGenerateSecret = await ask('¿Generar clave secreta automáticamente? (Y/n): ');
  let sessionSecret = '';
  
  if (autoGenerateSecret.toLowerCase() === 'n' || autoGenerateSecret.toLowerCase() === 'no') {
    sessionSecret = await ask('Clave secreta para sesiones: ');
  } else {
    sessionSecret = generateSecretKey();
    log(`✅ Clave secreta generada: ${sessionSecret.substring(0, 16)}...`, 'green');
  }

  // Configuración opcional
  log('\n⚙️  Configuración Opcional', 'bright');
  log('-------------------------\n', 'cyan');

  const organization = await ask('Nombre de tu organización (opcional): ');
  const enableDemo = await ask('¿Habilitar modo demo? (Y/n): ');
  const enableRegistration = await ask('¿Permitir registro de usuarios? (Y/n): ');

  // Generar archivo .env
  log('\n📝 Generando archivo .env...', 'blue');

  const envContent = `# ============================================================================
# CONFIGURACIÓN GENERADA AUTOMÁTICAMENTE PARA SAT PROJECT
# Generado el: ${new Date().toISOString()}
# ============================================================================

# ============================================================================
# CONFIGURACIÓN DEL SERVIDOR
# ============================================================================
PORT=${port}
NODE_ENV=${nodeEnv}
BASE_URL=http://localhost:${port}

# ============================================================================
# CONFIGURACIÓN DE SUPABASE
# ============================================================================
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${anonKey}
${serviceRoleKey ? `SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}` : '# SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui'}

# ============================================================================
# CONFIGURACIÓN DE AUTENTICACIÓN Y SESIONES
# ============================================================================
SESSION_SECRET=${sessionSecret}
BCRYPT_ROUNDS=12
SESSION_MAX_AGE=86400000
SESSION_NAME=sat-session

# ============================================================================
# CONFIGURACIÓN DE BASE DE DATOS
# ============================================================================
DATABASE_MODE=${nodeEnv}
DB_POOL_MIN=2
DB_POOL_MAX=10

# ============================================================================
# CONFIGURACIÓN DE ARCHIVOS Y UPLOADS
# ============================================================================
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
UPLOAD_DIR=./uploads

# ============================================================================
# CONFIGURACIÓN DE EMAIL (COMPLETAR SI ES NECESARIO)
# ============================================================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=noreply@${organization ? organization.toLowerCase().replace(/\s+/g, '-') : 'sat-sistema'}.com
FROM_NAME=${organization || 'Sistema SAT'}

# ============================================================================
# CONFIGURACIÓN DE LOGS
# ============================================================================
LOG_LEVEL=${nodeEnv === 'production' ? 'warn' : 'debug'}
LOG_DIR=./logs

# ============================================================================
# CONFIGURACIÓN DE SEGURIDAD
# ============================================================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:${port}
CORS_CREDENTIALS=true

# ============================================================================
# CONFIGURACIÓN DE FUNCIONALIDADES
# ============================================================================
ENABLE_USER_REGISTRATION=${enableRegistration.toLowerCase() !== 'n' && enableRegistration.toLowerCase() !== 'no'}
MAINTENANCE_MODE=false
APP_VERSION=1.0.0

# ============================================================================
# CONFIGURACIÓN DE DESARROLLO
# ============================================================================
SHOW_DETAILED_ERRORS=${nodeEnv !== 'production'}
ENABLE_HOT_RELOAD=${nodeEnv === 'development'}
DEMO_MODE=${enableDemo.toLowerCase() !== 'n' && enableDemo.toLowerCase() !== 'no'}
`;

  try {
    fs.writeFileSync(envPath, envContent);
    log('✅ Archivo .env creado exitosamente!', 'green');
  } catch (error) {
    log(`❌ Error al crear .env: ${error.message}`, 'red');
    process.exit(1);
  }

  // Crear directorio de uploads si no existe
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
      log('✅ Directorio de uploads creado', 'green');
    } catch (error) {
      log(`⚠️  No se pudo crear directorio uploads: ${error.message}`, 'yellow');
    }
  }

  // Crear directorio de logs si no existe
  const logsDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logsDir)) {
    try {
      fs.mkdirSync(logsDir, { recursive: true });
      log('✅ Directorio de logs creado', 'green');
    } catch (error) {
      log(`⚠️  No se pudo crear directorio logs: ${error.message}`, 'yellow');
    }
  }

  // Mostrar siguientes pasos
  log('\n🎉 ¡Configuración completada!', 'bright');
  log('============================\n', 'green');

  log('Próximos pasos:', 'bright');
  log('1. Instalar dependencias:', 'blue');
  log('   npm install\n', 'cyan');
  
  log('2. Configurar base de datos en Supabase:', 'blue');
  log('   - Ejecuta el SQL del archivo ENV_SETUP.md', 'cyan');
  log('   - Configura las políticas RLS si es necesario\n', 'cyan');

  if (!serviceRoleKey && nodeEnv !== 'development') {
    log('3. ⚠️  Configurar SUPABASE_SERVICE_ROLE_KEY:', 'yellow');
    log('   - Edita .env y agrega la clave de rol de servicio', 'cyan');
    log('   - Esta clave es necesaria para operaciones administrativas\n', 'cyan');
  }

  log('4. Iniciar el servidor:', 'blue');
  log('   npm start\n', 'cyan');

  log('5. Abrir en el navegador:', 'blue');
  log(`   http://localhost:${port}\n`, 'cyan');

  if (enableDemo.toLowerCase() !== 'n' && enableDemo.toLowerCase() !== 'no') {
    log('💡 Modo demo habilitado:', 'magenta');
    log('   - Usuarios de prueba disponibles', 'dim');
    log('   - Datos de ejemplo incluidos', 'dim');
    log('   - Perfecto para testing\n', 'dim');
  }

  log('📚 Para más información, consulta:', 'blue');
  log('   - ENV_SETUP.md: Guía detallada de configuración', 'dim');
  log('   - README.md: Documentación completa del proyecto\n', 'dim');

  rl.close();
}

// Manejo de errores
process.on('SIGINT', () => {
  log('\n\n👋 Configuración cancelada por el usuario.', 'yellow');
  rl.close();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  log(`\n❌ Error inesperado: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});

// Ejecutar configuración
main().catch((error) => {
  log(`\n❌ Error: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});