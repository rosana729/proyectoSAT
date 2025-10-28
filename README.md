# 🔥 Sistema de Administración de Extintores (SAT)

Sistema web completo para la gestión y administración de extintores desarrollado con Node.js, Express y Supabase.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [API](#api)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contribución](#contribución)
- [Licencia](#licencia)

## 🚀 Características

### Funcionalidades Principales
- ✅ **Gestión de Extintores**: Registro, edición y seguimiento completo
- ✅ **Sistema de Autenticación**: Login/registro seguro con Passport.js
- ✅ **Dashboard Interactivo**: Estadísticas y métricas en tiempo real
- ✅ **Reportes Avanzados**: Generación de reportes PDF y Excel
- ✅ **Notificaciones**: Alertas de vencimientos y mantenimientos
- ✅ **API RESTful**: Endpoints completos para integración
- ✅ **Responsive Design**: Interfaz optimizada para móviles y desktop

### Características Técnicas
- 🔒 **Seguridad**: Helmet, CORS, Rate Limiting, validación de datos
- 📊 **Base de Datos**: PostgreSQL con Supabase y pooling de conexiones
- 🎨 **UI/UX**: Bootstrap 5 con diseño moderno y accesible
- ⚡ **Rendimiento**: Compresión, cache, optimización de assets
- 🔧 **Desarrollo**: ESM modules, validación automática, hot reload

## 🛠️ Tecnologías

### Backend
- **Node.js** 18+ (LTS)
- **Express.js** 4.x - Framework web
- **Supabase** - Base de datos PostgreSQL
- **Passport.js** - Autenticación
- **Express Validator** - Validación de datos
- **bcrypt** - Hashing de contraseñas

### Frontend
- **EJS** - Motor de plantillas
- **Bootstrap 5** - Framework CSS
- **JavaScript ES6+** - Funcionalidades interactivas
- **Chart.js** - Gráficos y visualizaciones

### DevOps y Herramientas
- **npm** - Gestión de paquetes
- **Git** - Control de versiones
- **ESLint** - Linting de código
- **Prettier** - Formateo de código

## 📋 Prerrequisitos

Antes de instalar el proyecto, asegúrate de tener:

- **Node.js** 18.0.0 o superior ([Descargar](https://nodejs.org/))
- **npm** 8.0.0 o superior (incluido con Node.js)
- **Git** ([Descargar](https://git-scm.com/))
- Cuenta en **Supabase** ([Registrarse](https://supabase.com/))

### Verificar instalaciones:
```bash
node --version    # v18.0.0+
npm --version     # 8.0.0+
git --version     # 2.0.0+
```

## ⚡ Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/sat-proyecto.git
cd sat-proyecto
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Copiar archivo de configuración
cp .env.example .env

# Ejecutar script de configuración interactiva
npm run setup:env
```

### 4. Inicializar base de datos
```bash
npm run db:init
```

### 5. Iniciar en modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

## ⚙️ Configuración

### Variables de Entorno

El proyecto utiliza múltiples archivos de configuración:

- **`.env`** - Configuración general (crear desde `.env.example`)
- **`.env.development`** - Configuración específica de desarrollo
- **`.env.production`** - Configuración de producción

### Configuración de Supabase

1. **Crear proyecto en Supabase**:
   - Ve a [https://supabase.com](https://supabase.com)
   - Crea un nuevo proyecto
   - Obtén la URL y API Key

2. **Configurar variables**:
   ```env
   # Base de Datos
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_ANON_KEY=tu-clave-publica
   SUPABASE_SERVICE_KEY=tu-clave-servicio
   
   # Base de datos directa
   DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres
   ```

3. **Ejecutar migraciones**:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

### Configuración de Autenticación

```env
# Sesiones
SESSION_SECRET=tu-secreto-super-seguro-aqui
SESSION_NAME=sat_session

# JWT (opcional)
JWT_SECRET=tu-jwt-secreto
JWT_EXPIRES_IN=7d
```

### Configuración del Servidor

```env
# Servidor
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 🚀 Uso

### Scripts NPM Disponibles

```bash
# Desarrollo
npm run dev          # Servidor con auto-reload
npm run dev:debug    # Modo debug

# Producción
npm start           # Servidor producción
npm run build       # Build para producción

# Base de datos
npm run db:init     # Inicializar BD
npm run db:migrate  # Ejecutar migraciones
npm run db:seed     # Datos de prueba
npm run db:reset    # Resetear BD

# Configuración
npm run setup:env   # Configurar entorno
npm run setup:full  # Configuración completa

# Mantenimiento
npm run lint        # Verificar código
npm run lint:fix    # Corregir código
npm run test        # Ejecutar pruebas
npm run clean       # Limpiar archivos
```

### Primer Uso

1. **Crear cuenta de administrador**:
   ```bash
   npm run create:admin
   ```

2. **Acceder al sistema**:
   - URL: http://localhost:3000
   - Email: admin@sat.com
   - Password: (definida durante setup)

3. **Configurar datos iniciales**:
   - Ir a Dashboard → Configuración
   - Completar información de la empresa
   - Configurar tipos de extintores

## 📡 API

### Endpoints Principales

#### Autenticación
```http
POST /auth/login          # Iniciar sesión
POST /auth/register       # Registrar usuario
POST /auth/logout         # Cerrar sesión
GET  /auth/profile        # Perfil del usuario
```

#### Extintores
```http
GET    /api/extinguishers           # Listar extintores
POST   /api/extinguishers           # Crear extintor
GET    /api/extinguishers/:id       # Obtener extintor
PUT    /api/extinguishers/:id       # Actualizar extintor
DELETE /api/extinguishers/:id       # Eliminar extintor
```

#### Reportes
```http
GET /api/reports                    # Listar reportes
POST /api/reports                   # Crear reporte
GET /api/reports/:id                # Obtener reporte
GET /api/reports/:id/pdf            # Descargar PDF
```

#### Dashboard
```http
GET /api/dashboard/stats            # Estadísticas generales
GET /api/dashboard/charts           # Datos para gráficos
GET /api/dashboard/alerts           # Alertas activas
```

### Ejemplos de Uso

#### Crear Extintor
```javascript
const response = await fetch('/api/extinguishers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    serial: 'EXT-001',
    type: 'ABC',
    location: 'Piso 1 - Oficina',
    capacity: '6kg',
    manufacturingDate: '2024-01-15',
    expirationDate: '2025-01-15'
  })
});

const extintor = await response.json();
```

#### Obtener Estadísticas
```javascript
const stats = await fetch('/api/dashboard/stats')
  .then(res => res.json());

console.log(stats);
// {
//   totalExtinguishers: 150,
//   activeExtinguishers: 140,
//   expiredExtinguishers: 5,
//   soonToExpire: 5
// }
```

## 📁 Estructura del Proyecto

```
sat-project/
├── 📁 src/
│   ├── 📁 config/           # Configuración
│   │   ├── database.js      # Conexión BD
│   │   ├── keys.js          # Variables entorno
│   │   └── passport.js      # Autenticación
│   ├── 📁 controllers/      # Controladores
│   │   ├── authController.js
│   │   ├── homeController.js
│   │   └── reportController.js
│   ├── 📁 models/           # Modelos de datos
│   │   ├── User.js
│   │   ├── Extinguisher.js
│   │   └── Report.js
│   ├── 📁 routes/           # Rutas
│   │   ├── index.js
│   │   ├── auth.js
│   │   └── api.js
│   ├── 📁 utils/            # Utilidades
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── 📁 views/            # Plantillas EJS
│   │   ├── 📁 partials/
│   │   ├── 📁 pages/
│   │   └── layouts/
│   └── index.js             # Servidor principal
├── 📁 public/               # Archivos estáticos
│   ├── 📁 css/
│   ├── 📁 js/
│   └── 📁 images/
├── 📁 scripts/              # Scripts utilidad
├── 📁 docs/                 # Documentación
├── 📄 package.json
├── 📄 .env.example
├── 📄 .gitignore
└── 📄 README.md
```

### Descripción de Directorios

- **`src/`**: Código fuente principal
- **`config/`**: Archivos de configuración y conexiones
- **`controllers/`**: Lógica de negocio y manejo de requests
- **`models/`**: Modelos de datos y esquemas
- **`routes/`**: Definición de rutas y endpoints
- **`utils/`**: Funciones auxiliares y validadores
- **`views/`**: Plantillas EJS para el frontend
- **`public/`**: Assets estáticos (CSS, JS, imágenes)
- **`scripts/`**: Scripts de automatización y setup

## 🔧 Desarrollo

### Guía de Estilo

- **ESLint**: Configuración estándar con reglas personalizadas
- **Prettier**: Formateo automático de código
- **Commits**: Conventional Commits

### Workflow de Desarrollo

1. **Crear rama de feature**:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Desarrollar y probar**:
   ```bash
   npm run dev
   npm run lint
   npm run test
   ```

3. **Commit y push**:
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```

### Testing

```bash
# Ejecutar todas las pruebas
npm test

# Pruebas con coverage
npm run test:coverage

# Pruebas unitarias
npm run test:unit

# Pruebas de integración
npm run test:integration
```

## 🚀 Despliegue

### Preparación para Producción

1. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env.production
   # Editar .env.production con valores de producción
   ```

2. **Build de producción**:
   ```bash
   npm run build
   ```

3. **Optimizar base de datos**:
   ```bash
   npm run db:optimize
   ```

### Opciones de Despliegue

#### Heroku
```bash
# Configurar Heroku
heroku create sat-sistema
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=tu-url-postgresql

# Deploy
git push heroku main
```

#### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Docker
```dockerfile
# Dockerfile incluido en el proyecto
docker build -t sat-sistema .
docker run -p 3000:3000 sat-sistema
```

## 🔒 Seguridad

### Medidas Implementadas

- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Helmet**: Headers de seguridad HTTP
- **Validación**: Sanitización de inputs del usuario
- **Autenticación**: Sesiones seguras con Passport.js
- **CORS**: Configuración restrictiva de cross-origin
- **Environment**: Variables sensibles en archivos de entorno

### Buenas Prácticas

- Mantener dependencias actualizadas
- Usar HTTPS en producción
- Configurar firewall y monitoring
- Realizar backups regulares de la BD
- Implementar logging de seguridad

## 🐛 Troubleshooting

### Problemas Comunes

#### Error de conexión a base de datos
```bash
# Verificar variables de entorno
npm run check:env

# Probar conexión
npm run db:test

# Reinicializar BD
npm run db:reset
```

#### Puerto en uso
```bash
# Cambiar puerto en .env
PORT=3001

# O terminar proceso
sudo lsof -ti:3000 | xargs kill -9
```

#### Problemas de permisos
```bash
# Limpiar caché npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Logs y Debugging

```bash
# Logs detallados
DEBUG=sat:* npm run dev

# Logs de base de datos
DEBUG=sat:db npm run dev

# Modo verbose
npm run dev:verbose
```

## 📞 Soporte

### Reportar Issues

1. Verificar issues existentes en GitHub
2. Incluir información del entorno:
   - Versión de Node.js
   - Sistema operativo
   - Versión del proyecto
   - Logs de error

### Contacto

- **Email**: soporte@sat-sistema.com
- **GitHub**: [Crear Issue](https://github.com/usuario/sat-proyecto/issues)
- **Documentación**: [Wiki del Proyecto](https://github.com/usuario/sat-proyecto/wiki)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crear rama de feature
3. Commit los cambios
4. Push a la rama
5. Crear Pull Request

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

## 📈 Roadmap

### Versión 2.0
- [ ] Aplicación móvil nativa
- [ ] Integración con códigos QR
- [ ] Sistema de notificaciones push
- [ ] Dashboard avanzado con BI

### Versión 2.1
- [ ] API GraphQL
- [ ] Microservicios
- [ ] Integración con IoT
- [ ] Machine Learning para predicciones

---

<div align="center">
  <h3>🔥 Sistema SAT - Gestión Inteligente de Extintores</h3>
  <p>Desarrollado con ❤️ para la seguridad empresarial</p>
  
  [![GitHub Stars](https://img.shields.io/github/stars/usuario/sat-proyecto?style=social)](https://github.com/usuario/sat-proyecto/stargazers)
  [![GitHub Forks](https://img.shields.io/github/forks/usuario/sat-proyecto?style=social)](https://github.com/usuario/sat-proyecto/network/members)
  [![GitHub Issues](https://img.shields.io/github/issues/usuario/sat-proyecto)](https://github.com/usuario/sat-proyecto/issues)
  
</div>