# Configuración de Variables de Entorno para SAT Project

## 📋 Guía de Configuración

### 🚀 Inicio Rápido

1. **Copia el archivo de configuración:**
   ```bash
   cp .env.example .env
   ```

2. **Configura las variables esenciales:**
   - `SUPABASE_URL`: URL de tu proyecto Supabase
   - `SUPABASE_ANON_KEY`: Clave anónima de Supabase
   - `SUPABASE_SERVICE_ROLE_KEY`: Clave de rol de servicio (solo para operaciones administrativas)
   - `SESSION_SECRET`: Una cadena aleatoria y segura para las sesiones

### 🔗 Obtener Credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto o accede a uno existente
3. En el dashboard, ve a **Settings** > **API**
4. Copia las siguientes credenciales:
   - **URL**: `https://tu-proyecto.supabase.co`
   - **anon public**: Esta es tu `SUPABASE_ANON_KEY`
   - **service_role**: Esta es tu `SUPABASE_SERVICE_ROLE_KEY` (⚠️ MANTENER SECRETA)

### 🗄️ Configuración de Base de Datos

El sistema SAT requiere las siguientes tablas en Supabase:

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'viewer',
  organization VARCHAR(200),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de extintores
CREATE TABLE extinguishers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(100),
  location VARCHAR(200) NOT NULL,
  installation_date DATE,
  last_maintenance DATE,
  next_maintenance DATE,
  status VARCHAR(50) DEFAULT 'operational',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de reportes
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  extinguisher_id UUID REFERENCES extinguishers(id),
  inspector_id UUID REFERENCES users(id),
  inspection_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) NOT NULL,
  pressure_status VARCHAR(50),
  weight_status VARCHAR(50),
  physical_condition VARCHAR(50),
  observations TEXT,
  photos TEXT[], -- Array de URLs de fotos
  next_inspection_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 🔐 Configuración de Seguridad

#### Generar SESSION_SECRET seguro:

**En Node.js:**
```javascript
const crypto = require('crypto');
console.log(crypto.randomBytes(64).toString('hex'));
```

**En línea de comandos:**
```bash
# Linux/Mac
openssl rand -hex 64

# Windows PowerShell
[System.Convert]::ToBase64String((1..64 | ForEach {Get-Random -Minimum 0 -Maximum 256}))
```

### 🌍 Variables por Entorno

#### Desarrollo Local
```env
NODE_ENV=development
SHOW_DETAILED_ERRORS=true
DEMO_MODE=true
LOG_LEVEL=debug
```

#### Producción
```env
NODE_ENV=production
SHOW_DETAILED_ERRORS=false
DEMO_MODE=false
LOG_LEVEL=warn
SESSION_SECRET=tu_secret_super_seguro_y_largo
CORS_ORIGIN=https://tu-dominio.com
BASE_URL=https://tu-dominio.com
```

### 📧 Configuración de Email (Opcional)

Para habilitar el envío de emails (notificaciones, reset de contraseña):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
FROM_EMAIL=noreply@tu-dominio.com
FROM_NAME=Sistema SAT
```

**Para Gmail:**
1. Habilita la verificación en 2 pasos
2. Genera una contraseña de aplicación
3. Usa esa contraseña en `SMTP_PASS`

### 🔍 Validación de Configuración

El sistema validará automáticamente la configuración al iniciarse. Verifica:

- ✅ Variables esenciales están configuradas
- ✅ URLs de Supabase son válidas
- ✅ Claves no contienen valores de ejemplo
- ✅ Configuración de producción es segura

### 🚨 Troubleshooting

#### Error: "Faltan variables de entorno"
- Verifica que el archivo `.env` existe
- Asegúrate de que las variables requeridas están configuradas
- No uses comillas en los valores

#### Error de conexión a Supabase
- Verifica la URL del proyecto
- Confirma que las claves son correctas
- Revisa que el proyecto Supabase está activo

#### Problemas de sesión
- Genera un nuevo `SESSION_SECRET`
- Limpia las cookies del navegador
- Verifica la configuración de CORS

### 🔧 Configuración Avanzada

#### Rate Limiting
```env
RATE_LIMIT_WINDOW_MS=900000  # 15 minutos
RATE_LIMIT_MAX_REQUESTS=100  # 100 requests por ventana
```

#### Upload de Archivos
```env
MAX_FILE_SIZE=10485760       # 10MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf
UPLOAD_DIR=./uploads
```

#### Logs
```env
LOG_LEVEL=info              # error, warn, info, debug
LOG_DIR=./logs
```

### 📝 Ejemplo Completo

Ver el archivo `.env.example` para un ejemplo completo con todas las opciones disponibles.

### 🔒 Seguridad

- **NUNCA** subas el archivo `.env` al repositorio
- Usa diferentes valores en desarrollo y producción
- Rota las claves regularmente en producción
- Mantén los logs seguros y no expongas información sensible

### 🆘 Soporte

Si tienes problemas con la configuración:
1. Revisa la consola de errores al iniciar la aplicación
2. Verifica los logs del sistema
3. Consulta la documentación de Supabase
4. Contacta al equipo de desarrollo