/**
 * Test de importaciones - para identificar cuál falla
 */

console.log('🔄 Iniciando test de importaciones...');

try {
    console.log('1. Importando express...');
    const express = await import('express');
    console.log('✅ Express importado correctamente');

    console.log('2. Importando fileURLToPath...');
    const { fileURLToPath } = await import('url');
    console.log('✅ fileURLToPath importado correctamente');

    console.log('3. Importando path utils...');
    const { dirname, join } = await import('path');
    console.log('✅ Path utils importados correctamente');

    console.log('4. Importando keys...');
    const keys = await import('./src/config/keys.js');
    console.log('✅ Keys importado correctamente');

    console.log('5. Importando database...');
    const { testConnection, initializeDatabase } = await import('./src/config/database.js');
    console.log('✅ Database config importado correctamente');

    console.log('6. Importando passport config...');
    await import('./src/config/passport.js');
    console.log('✅ Passport config importado correctamente');

    console.log('7. Importando rutas index...');
    const indexRoutes = await import('./src/routes/index.js');
    console.log('✅ Index routes importado correctamente');

    console.log('8. Importando rutas auth...');
    const authRoutes = await import('./src/routes/auth.js');
    console.log('✅ Auth routes importado correctamente');

    console.log('9. Importando rutas api...');
    const apiRoutes = await import('./src/routes/api.js');
    console.log('✅ API routes importado correctamente');

    console.log('\n🎉 Todas las importaciones fueron exitosas!');

} catch (error) {
    console.error('❌ Error en importación:', error.message);
    console.error('📍 Stack:', error.stack);
}