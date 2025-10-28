/**
 * ============================================================================
 * SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS PARA SUPABASE
 * ============================================================================
 * Crea las tablas y configuraciones necesarias para el Sistema SAT
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Verificar variables de entorno
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ Error: SUPABASE_URL y SUPABASE_ANON_KEY son requeridas');
    process.exit(1);
}

// Crear cliente de Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

/**
 * SQL para crear las tablas necesarias
 */
const createTablesSQL = `
-- ============================================================================
-- TABLA: users (Usuarios del sistema)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'manager')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- ============================================================================
-- TABLA: extinguishers (Extintores)
-- ============================================================================
CREATE TABLE IF NOT EXISTS extinguishers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ABC', 'BC', 'CO2', 'K', 'Agua')),
    capacity VARCHAR(20) NOT NULL,
    location VARCHAR(255) NOT NULL,
    building VARCHAR(100),
    floor VARCHAR(50),
    zone VARCHAR(100),
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    manufacturing_date DATE,
    installation_date DATE,
    last_inspection_date DATE,
    next_inspection_date DATE,
    expiration_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'maintenance', 'retired')),
    condition VARCHAR(50) DEFAULT 'good' CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
    pressure_level DECIMAL(5,2),
    weight_kg DECIMAL(8,2),
    notes TEXT,
    qr_code VARCHAR(255),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_extinguishers_serial ON extinguishers(serial_number);
CREATE INDEX IF NOT EXISTS idx_extinguishers_type ON extinguishers(type);
CREATE INDEX IF NOT EXISTS idx_extinguishers_location ON extinguishers(location);
CREATE INDEX IF NOT EXISTS idx_extinguishers_status ON extinguishers(status);
CREATE INDEX IF NOT EXISTS idx_extinguishers_expiration ON extinguishers(expiration_date);
CREATE INDEX IF NOT EXISTS idx_extinguishers_next_inspection ON extinguishers(next_inspection_date);

-- ============================================================================
-- TABLA: inspections (Inspecciones)
-- ============================================================================
CREATE TABLE IF NOT EXISTS inspections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    extinguisher_id UUID REFERENCES extinguishers(id) ON DELETE CASCADE,
    inspector_id UUID REFERENCES users(id),
    inspection_date DATE NOT NULL,
    inspection_type VARCHAR(50) NOT NULL CHECK (inspection_type IN ('monthly', 'annual', 'maintenance', 'emergency')),
    overall_condition VARCHAR(50) NOT NULL CHECK (overall_condition IN ('excellent', 'good', 'fair', 'poor')),
    pressure_check BOOLEAN DEFAULT false,
    seal_intact BOOLEAN DEFAULT false,
    pin_present BOOLEAN DEFAULT false,
    hose_condition VARCHAR(50),
    gauge_reading DECIMAL(5,2),
    weight_kg DECIMAL(8,2),
    discharge_test BOOLEAN DEFAULT false,
    observations TEXT,
    recommendations TEXT,
    photos JSONB,
    passed BOOLEAN NOT NULL,
    next_inspection_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_inspections_extinguisher ON inspections(extinguisher_id);
CREATE INDEX IF NOT EXISTS idx_inspections_date ON inspections(inspection_date);
CREATE INDEX IF NOT EXISTS idx_inspections_type ON inspections(inspection_type);
CREATE INDEX IF NOT EXISTS idx_inspections_passed ON inspections(passed);

-- ============================================================================
-- TABLA: reports (Reportes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('inspection', 'maintenance', 'inventory', 'compliance', 'custom')),
    description TEXT,
    generated_by UUID REFERENCES users(id),
    date_from DATE,
    date_to DATE,
    filters JSONB,
    data JSONB,
    file_path VARCHAR(500),
    file_format VARCHAR(20) CHECK (file_format IN ('pdf', 'excel', 'csv')),
    status VARCHAR(50) DEFAULT 'generating' CHECK (status IN ('generating', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_generated_by ON reports(generated_by);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);

-- ============================================================================
-- TABLA: notifications (Notificaciones)
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
    priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- ============================================================================
-- TABLA: settings (Configuraciones del sistema)
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    type VARCHAR(50) DEFAULT 'string' CHECK (type IN ('string', 'number', 'boolean', 'json')),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_public ON settings(is_public);

-- ============================================================================
-- FUNCIONES Y TRIGGERS
-- ============================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_extinguishers_updated_at BEFORE UPDATE ON extinguishers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON inspections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE extinguishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para extinguishers (todos los usuarios autenticados pueden ver)
CREATE POLICY "Authenticated users can view extinguishers" ON extinguishers
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert extinguishers" ON extinguishers
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update extinguishers" ON extinguishers
    FOR UPDATE TO authenticated USING (true);

-- Políticas para inspections
CREATE POLICY "Authenticated users can view inspections" ON inspections
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert inspections" ON inspections
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update inspections" ON inspections
    FOR UPDATE TO authenticated USING (true);

-- Políticas para reports
CREATE POLICY "Users can view own reports" ON reports
    FOR SELECT USING (auth.uid() = generated_by);

CREATE POLICY "Users can insert own reports" ON reports
    FOR INSERT WITH CHECK (auth.uid() = generated_by);

-- Políticas para notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para settings (solo lectura para configuraciones públicas)
CREATE POLICY "Anyone can view public settings" ON settings
    FOR SELECT USING (is_public = true);
`;

/**
 * SQL para insertar datos iniciales
 */
const insertInitialDataSQL = `
-- ============================================================================
-- DATOS INICIALES: settings
-- ============================================================================
INSERT INTO settings (key, value, description, type, is_public) VALUES
    ('app_name', 'Sistema SAT', 'Nombre de la aplicación', 'string', true),
    ('app_version', '1.0.0', 'Versión de la aplicación', 'string', true),
    ('company_name', 'Empresa SAT', 'Nombre de la empresa', 'string', true),
    ('company_address', '', 'Dirección de la empresa', 'string', false),
    ('company_phone', '', 'Teléfono de la empresa', 'string', false),
    ('company_email', '', 'Email de la empresa', 'string', false),
    ('inspection_frequency_months', '12', 'Frecuencia de inspección en meses', 'number', false),
    ('notification_email_enabled', 'true', 'Habilitar notificaciones por email', 'boolean', false),
    ('maintenance_mode', 'false', 'Modo de mantenimiento', 'boolean', false),
    ('default_extinguisher_types', '["ABC", "BC", "CO2", "K", "Agua"]', 'Tipos de extintores disponibles', 'json', true)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- DATOS INICIALES: usuario administrador (solo si no existe)
-- ============================================================================
-- Nota: La contraseña deberá ser establecida a través de la aplicación
-- Este es solo un placeholder para el usuario admin
`;

/**
 * Función principal para inicializar la base de datos
 */
async function initializeDatabase() {
    try {
        console.log('🔄 Inicializando base de datos de Supabase...');
        
        // Nota: En Supabase, las tablas y funciones se crean generalmente
        // a través del panel de administración o usando la función rpc()
        // Para este caso, mostraremos las instrucciones SQL
        
        console.log('📋 SQL para crear tablas (ejecutar en Supabase SQL Editor):');
        console.log('=' .repeat(80));
        console.log(createTablesSQL);
        console.log('=' .repeat(80));
        
        console.log('\n📋 SQL para datos iniciales:');
        console.log('=' .repeat(80));
        console.log(insertInitialDataSQL);
        console.log('=' .repeat(80));
        
        // Verificar conexión
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);
            
        if (error && error.code === 'PGRST116') {
            console.log('\n⚠️  Las tablas no existen aún. Por favor:');
            console.log('1. Ve a tu panel de Supabase: https://supabase.com/dashboard');
            console.log('2. Selecciona tu proyecto');
            console.log('3. Ve a SQL Editor');
            console.log('4. Copia y ejecuta el SQL mostrado arriba');
            console.log('5. Luego ejecuta: npm run db:verify');
        } else if (error) {
            console.error('❌ Error verificando base de datos:', error);
        } else {
            console.log('✅ Base de datos conectada correctamente');
            console.log('✅ Tablas disponibles y funcionando');
        }
        
    } catch (error) {
        console.error('❌ Error inicializando base de datos:', error);
        process.exit(1);
    }
}

/**
 * Función para verificar la base de datos
 */
async function verifyDatabase() {
    try {
        console.log('🔍 Verificando estructura de base de datos...');
        
        const tables = ['users', 'extinguishers', 'inspections', 'reports', 'notifications', 'settings'];
        
        for (const table of tables) {
            try {
                const { data, error } = await supabase
                    .from(table)
                    .select('*')
                    .limit(1);
                    
                if (error) {
                    console.log(`❌ Tabla ${table}: ${error.message}`);
                } else {
                    console.log(`✅ Tabla ${table}: OK`);
                }
            } catch (err) {
                console.log(`❌ Tabla ${table}: Error de conexión`);
            }
        }
        
    } catch (error) {
        console.error('❌ Error verificando base de datos:', error);
    }
}

// Ejecutar función según argumento
const command = process.argv[2];

if (command === 'verify') {
    verifyDatabase();
} else {
    initializeDatabase();
}

export { initializeDatabase, verifyDatabase };