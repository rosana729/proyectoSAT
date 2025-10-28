/**
 * ============================================================================
 * SISTEMA DE ADMINISTRACIÓN DE EXTINTORES (SAT) - SERVIDOR PRINCIPAL
 * ============================================================================
 * Archivo principal del servidor Express.js
 * Configura middleware, rutas, autenticación y manejo de errores
 */

// ============================================================================
// IMPORTACIONES Y DEPENDENCIAS
// ============================================================================
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';

// Importaciones locales
import keys from './config/keys.js';
import { testConnection, initializeDatabase } from './config/database.js';
import './config/passport.js';

// Importaciones de rutas
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';

// ============================================================================
// CONFIGURACIÓN INICIAL
// ============================================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

// ============================================================================
// MIDDLEWARE DE SEGURIDAD
// ============================================================================

// Helmet para headers de seguridad
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            connectSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// CORS configuración
app.use(cors({
    origin: keys.security.cors.origin,
    credentials: keys.security.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: keys.security.rateLimit.windowMs,
    max: keys.security.rateLimit.maxRequests,
    message: {
        error: 'Demasiadas solicitudes desde esta IP, intente nuevamente más tarde.',
        retryAfter: Math.ceil(keys.security.rateLimit.windowMs / 1000 / 60) + ' minutos'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting para archivos estáticos
        return req.url.startsWith('/css') || 
               req.url.startsWith('/js') || 
               req.url.startsWith('/images');
    }
});

app.use(limiter);

// Rate limiting más estricto para rutas de autenticación
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos por ventana
    message: {
        error: 'Demasiados intentos de inicio de sesión, intente nuevamente en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// ============================================================================
// MIDDLEWARE GENERAL
// ============================================================================

// Compresión
app.use(compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    },
    threshold: 1024,
    level: 6
}));

// Parseo de datos
app.use(express.json({ 
    limit: keys.upload.maxFileSize,
    type: ['application/json', 'text/plain']
}));
app.use(express.urlencoded({ 
    extended: true, 
    limit: keys.upload.maxFileSize,
    parameterLimit: 100
}));

// Archivos estáticos
app.use(express.static(join(__dirname, '..', 'public'), {
    maxAge: keys.cache.staticFiles,
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
        // Headers específicos para diferentes tipos de archivos
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (path.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
            res.setHeader('Cache-Control', `public, max-age=${keys.cache.images}`);
        }
    }
}));

// ============================================================================
// CONFIGURACIÓN DE SESIONES Y AUTENTICACIÓN
// ============================================================================

// Configuración de sesiones
app.use(session({
    secret: keys.session.secret,
    name: keys.session.name,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        secure: keys.nodeEnv === 'production',
        httpOnly: true,
        maxAge: keys.session.maxAge,
        sameSite: 'lax'
    },
    store: undefined // TODO: Implementar store de sesiones para producción (Redis/MemoryStore)
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// ============================================================================
// CONFIGURACIÓN DEL MOTOR DE VISTAS
// ============================================================================
app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

// ============================================================================
// MIDDLEWARE PERSONALIZADO
// ============================================================================

// Logging de requests en desarrollo
if (keys.nodeEnv !== 'production') {
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        const method = req.method;
        const url = req.url;
        const ip = req.ip || req.connection.remoteAddress;
        console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
        next();
    });
}

// Variables globales para las vistas
app.use((req, res, next) => {
    // Usuario autenticado
    res.locals.user = req.user || null;
    res.locals.isAuthenticated = req.isAuthenticated();
    
    // Flash messages
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    
    // Información de la aplicación
    res.locals.appName = process.env.APP_NAME || 'Sistema SAT';
    res.locals.appVersion = keys.appVersion;
    res.locals.environment = keys.nodeEnv;
    
    // URLs actuales
    res.locals.currentUrl = req.url;
    res.locals.currentPath = req.path;
    
    // Configuración del cliente
    res.locals.clientConfig = {
        apiEndpoint: '/api',
        maxFileSize: keys.upload.maxFileSize,
        allowedFileTypes: keys.upload.allowedTypes,
        environment: keys.nodeEnv
    };
    
    next();
});

// Middleware de manejo de errores CSRF (si se implementa)
app.use((req, res, next) => {
    // TODO: Implementar protección CSRF si es necesario
    next();
});

// ============================================================================
// RUTAS
// ============================================================================

// Aplicar rate limiting a rutas de autenticación
app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);

// Rutas principales
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: keys.nodeEnv,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: keys.app.version
    });
});

// ============================================================================
// MANEJO DE ERRORES
// ============================================================================

// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    // Log del error
    console.error(`[${new Date().toISOString()}] Error:`, {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    // Configurar error response
    err.status = err.status || 500;
    const isDevelopment = keys.nodeEnv !== 'production';
    
    // Para requests AJAX, responder con JSON
    if (req.xhr || req.headers.accept?.includes('application/json')) {
        res.status(err.status).json({
            success: false,
            message: isDevelopment ? err.message : 'Error interno del servidor',
            error: isDevelopment ? {
                status: err.status,
                stack: err.stack
            } : {}
        });
    } else {
        // Para requests normales, renderizar página de error
        res.status(err.status);
        
        if (err.status === 404) {
            res.render('error', {
                title: 'Página no encontrada',
                message: 'La página que busca no existe',
                error: isDevelopment ? err : {},
                statusCode: 404,
                environment: keys.nodeEnv,
                showErrors: isDevelopment
            });
        } else {
            res.render('error', {
                title: 'Error del servidor',
                message: isDevelopment ? err.message : 'Ha ocurrido un error interno',
                error: isDevelopment ? err : {},
                statusCode: err.status,
                environment: keys.nodeEnv,
                showErrors: isDevelopment
            });
        }
    }
});

// ============================================================================
// INICIALIZACIÓN DEL SERVIDOR
// ============================================================================

/**
 * Función para inicializar la base de datos
 */
async function initializeApp() {
    try {
        console.log('🔄 Iniciando Sistema SAT...');
        
        // TODO: Verificar conexión a la base de datos cuando las credenciales estén correctas
        console.log('⚠️  Saltando verificación de base de datos (modo desarrollo)');
        
        // TODO: Inicializar esquemas cuando la conexión esté configurada
        console.log('⚠️  Saltando inicialización de esquemas (modo desarrollo)');
        
        console.log('✅ Aplicación inicializada en modo desarrollo');
        return true;
    } catch (error) {
        console.error('❌ Error inicializando la aplicación:', error);
        throw error;
    }
}

/**
 * Función para iniciar el servidor
 */
async function startServer() {
    try {
        // Inicializar aplicación
        await initializeApp();
        
        // Iniciar servidor
        const port = keys.port;
        server.listen(port, () => {
            console.log('\n🚀 ============================================');
            console.log(`🚀 Sistema SAT iniciado correctamente`);
            console.log(`🌐 Servidor: http://localhost:${port}`);
            console.log(`🔧 Entorno: ${keys.nodeEnv}`);
            console.log(`📦 Versión: ${keys.appVersion}`);
            console.log(`🕐 Iniciado: ${new Date().toLocaleString('es-ES')}`);
            console.log('🚀 ============================================\n');
            
            // En desarrollo, mostrar información adicional
            if (keys.nodeEnv !== 'production') {
                console.log('📋 Rutas disponibles:');
                console.log('   🏠 Inicio: http://localhost:' + port);
                console.log('   📊 Dashboard: http://localhost:' + port + '/dashboard');
                console.log('   🔐 Login: http://localhost:' + port + '/auth/login');
                console.log('   📝 Registro: http://localhost:' + port + '/auth/register');
                console.log('   🔍 API: http://localhost:' + port + '/api');
                console.log('   ❤️  Health: http://localhost:' + port + '/health');
                console.log('');
            }
        });
        
        // Manejo de cierre graceful
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);
        
    } catch (error) {
        console.error('❌ Error iniciando el servidor:', error);
        process.exit(1);
    }
}

/**
 * Función para cierre graceful del servidor
 */
function gracefulShutdown(signal) {
    console.log(`\n🔄 Recibida señal ${signal}, cerrando servidor...`);
    
    server.close((err) => {
        if (err) {
            console.error('❌ Error cerrando servidor:', err);
            process.exit(1);
        }
        
        console.log('✅ Servidor cerrado correctamente');
        console.log('👋 ¡Hasta luego!');
        process.exit(0);
    });
    
    // Forzar cierre después de 10 segundos
    setTimeout(() => {
        console.error('❌ Forzando cierre del servidor...');
        process.exit(1);
    }, 10000);
}

// ============================================================================
// MANEJO DE ERRORES NO CAPTURADOS
// ============================================================================
process.on('uncaughtException', (error) => {
    console.error('❌ Excepción no capturada:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
    console.error('   Promesa:', promise);
    process.exit(1);
});

// ============================================================================
// EXPORTACIÓN E INICIO
// ============================================================================
export default app;

// Iniciar servidor si este archivo se ejecuta directamente
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                    import.meta.url.endsWith(process.argv[1]) ||
                    process.argv[1].includes('index.js');

if (isMainModule) {
    console.log('🔄 Iniciando servidor...');
    startServer().catch(error => {
        console.error('❌ Error fatal al iniciar:', error);
        process.exit(1);
    });
}
