/**
 * Versión simplificada para debug
 */

import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

console.log('✅ 1. Variables de entorno cargadas');

// Configuración inicial
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('✅ 2. Configuración de rutas completada');

try {
    // Importar configuración
    const keys = await import('./src/config/keys.js');
    console.log('✅ 3. Configuración de keys cargada');
    
    // Crear app Express
    const app = express();
    console.log('✅ 4. App Express creada');
    
    // Configurar EJS
    app.set('view engine', 'ejs');
    app.set('views', join(__dirname, 'src', 'views'));
    console.log('✅ 5. Motor de vistas configurado');
    
    // Ruta simple
    app.get('/', (req, res) => {
        res.send(`
            <h1>🚀 SAT Project - Funcionando!</h1>
            <p>Servidor iniciado correctamente en ${new Date().toLocaleString()}</p>
            <p>Puerto: ${process.env.PORT || 3000}</p>
            <p>Entorno: ${process.env.NODE_ENV || 'development'}</p>
            <p><a href="/health">Ver health check</a></p>
        `);
    });
    
    app.get('/health', (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            port: process.env.PORT || 3000,
            supabase_url: process.env.SUPABASE_URL ? 'configured' : 'missing'
        });
    });
    
    console.log('✅ 6. Rutas configuradas');
    
    // Iniciar servidor
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log('\n🚀 ============================================');
        console.log(`🚀 Servidor SAT iniciado correctamente`);
        console.log(`🌐 URL: http://localhost:${port}`);
        console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
        console.log('🚀 ============================================\n');
    });
    
} catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    console.error('📍 Stack trace:', error.stack);
}