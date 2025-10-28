// Archivo de prueba simple para verificar las importaciones
import express from 'express';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('¡Servidor de prueba funcionando! 🚀');
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        port: port
    });
});

app.listen(port, () => {
    console.log(`🚀 Servidor de prueba funcionando en http://localhost:${port}`);
});