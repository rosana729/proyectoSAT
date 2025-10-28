/**
 * Configuración de conexión a la base de datos Supabase
 * Maneja clientes regulares y administrativos con pools de conexión
 * @author SAT Project Team
 */

import { createClient } from '@supabase/supabase-js';
import { config } from './keys.js';

// ============================================================================
// CONFIGURACIÓN DE CLIENTES SUPABASE
// ============================================================================

/**
 * Cliente Supabase público (para operaciones generales)
 * Usa la clave anónima y tiene RLS habilitado
 */
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    db: {
      schema: config.database.schema
    },
    global: {
      headers: {
        'x-application-name': 'SAT-Project',
        'x-application-version': config.appVersion
      }
    },
    realtime: {
      enabled: true,
      heartbeatIntervalMs: 30000,
      reconnectAfterMs: (retries) => Math.min(retries * 1000, 30000)
    }
  }
);

/**
 * Cliente Supabase administrativo (para operaciones privilegiadas)
 * Usa la clave de rol de servicio y puede bypass RLS
 */
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: config.database.schema
    },
    global: {
      headers: {
        'x-application-name': 'SAT-Project-Admin',
        'x-application-version': config.appVersion
      }
    }
  }
);

// ============================================================================
// CONFIGURACIÓN DE POOL DE CONEXIONES
// ============================================================================

/**
 * Pool de conexiones para optimizar el rendimiento
 */
class ConnectionPool {
  constructor() {
    this.connections = new Map();
    this.maxConnections = config.database.connectionLimit;
    this.activeConnections = 0;
    this.metrics = {
      created: 0,
      destroyed: 0,
      active: 0,
      errors: 0
    };
  }

  /**
   * Obtener una conexión del pool
   */
  async getConnection(type = 'public') {
    const client = type === 'admin' ? supabaseAdmin : supabase;
    this.activeConnections++;
    this.metrics.active = this.activeConnections;
    
    if (config.development.showDetailedErrors) {
      console.log(`📊 Pool: ${this.activeConnections} conexiones activas`);
    }
    
    return client;
  }

  /**
   * Liberar una conexión
   */
  releaseConnection() {
    if (this.activeConnections > 0) {
      this.activeConnections--;
      this.metrics.active = this.activeConnections;
    }
  }

  /**
   * Obtener métricas del pool
   */
  getMetrics() {
    return {
      ...this.metrics,
      maxConnections: this.maxConnections,
      utilization: (this.activeConnections / this.maxConnections * 100).toFixed(2) + '%'
    };
  }
}

export const connectionPool = new ConnectionPool();

// ============================================================================
// FUNCIONES DE BASE DE DATOS
// ============================================================================

/**
 * Verificar conexión a la base de datos
 * @returns {Promise<boolean>} Estado de la conexión
 */
export async function testConnection() {
  try {
    console.log('🔌 Verificando conexión a Supabase...');
    
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true });
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    console.log('✅ Conexión a Supabase establecida correctamente');
    
    // Verificar también la conexión admin si está configurada
    if (config.supabase.serviceRoleKey && !config.supabase.serviceRoleKey.includes('ejemplo')) {
      const { error: adminError } = await supabaseAdmin
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      if (adminError && adminError.code !== 'PGRST116') {
        console.warn('⚠️  Conexión admin tiene problemas:', adminError.message);
      } else {
        console.log('✅ Conexión admin establecida correctamente');
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a Supabase:', error.message);
    
    if (error.message.includes('Invalid URL')) {
      console.error('   👉 Verifica SUPABASE_URL en tu archivo .env');
    } else if (error.message.includes('Invalid API key')) {
      console.error('   👉 Verifica SUPABASE_ANON_KEY en tu archivo .env');
    } else if (error.message.includes('Network')) {
      console.error('   👉 Verifica tu conexión a internet');
    }
    
    return false;
  }
}

/**
 * Ejecutar una consulta con retry automático
 * @param {Function} queryFn - Función que ejecuta la consulta
 * @param {number} maxRetries - Número máximo de reintentos
 * @returns {Promise<any>} Resultado de la consulta
 */
export async function executeWithRetry(queryFn, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await queryFn();
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result;
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.warn(`⚠️  Intento ${attempt} falló, reintentando en ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Inicializar la conexión de base de datos
 */
export async function initializeDatabase() {
  console.log('🚀 Inicializando base de datos...');
  
  // Verificar conexión
  const isConnected = await testConnection();
  if (!isConnected) {
    throw new Error('No se pudo establecer conexión con la base de datos');
  }
  
  // Configurar listeners de eventos si es desarrollo
  if (config.development.showDetailedErrors) {
    supabase.channel('schema-db-changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public' }, 
          payload => console.log('📡 Cambio en BD:', payload))
      .subscribe();
  }
  
  console.log('✅ Base de datos inicializada correctamente');
  return true;
}

/**
 * Esquemas de las tablas principales
 * Define la estructura esperada de la base de datos
 */
export const schemas = {
  users: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    email: 'varchar UNIQUE NOT NULL',
    password_hash: 'varchar NOT NULL',
    first_name: 'varchar(100) NOT NULL',
    last_name: 'varchar(100) NOT NULL',
    role: 'varchar(50) DEFAULT \'viewer\'',
    organization: 'varchar(200)',
    is_active: 'boolean DEFAULT true',
    created_at: 'timestamp with time zone DEFAULT NOW()',
    updated_at: 'timestamp with time zone DEFAULT NOW()'
  },
  
  extinguishers: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    serial_number: 'varchar(100) UNIQUE NOT NULL',
    type: 'varchar(50) NOT NULL',
    brand: 'varchar(100)',
    model: 'varchar(100)',
    location: 'varchar(200) NOT NULL',
    installation_date: 'date',
    last_maintenance: 'date',
    next_maintenance: 'date',
    status: 'varchar(50) DEFAULT \'operational\'',
    created_by: 'uuid REFERENCES users(id)',
    created_at: 'timestamp with time zone DEFAULT NOW()',
    updated_at: 'timestamp with time zone DEFAULT NOW()'
  },
  
  reports: {
    id: 'uuid PRIMARY KEY DEFAULT gen_random_uuid()',
    extinguisher_id: 'uuid REFERENCES extinguishers(id)',
    inspector_id: 'uuid REFERENCES users(id)',
    inspection_date: 'timestamp with time zone DEFAULT NOW()',
    status: 'varchar(50) NOT NULL',
    pressure_status: 'varchar(50)',
    weight_status: 'varchar(50)',
    physical_condition: 'varchar(50)',
    observations: 'text',
    photos: 'text[]',
    next_inspection_date: 'date',
    created_at: 'timestamp with time zone DEFAULT NOW()'
  }
};

export default {
  supabase,
  supabaseAdmin,
  connectionPool,
  testConnection,
  executeWithRetry,
  initializeDatabase,
  schemas
};