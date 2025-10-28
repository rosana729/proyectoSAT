/**
 * Test para verificar configuración de keys
 */

import keys from './src/config/keys.js';

console.log('🔍 Verificando configuración...');
console.log('Port:', keys.port);
console.log('NodeEnv:', keys.nodeEnv);
console.log('AppVersion:', keys.appVersion);
console.log('Supabase URL:', keys.supabase?.url);

// Verificar todas las propiedades disponibles
console.log('\n📋 Todas las propiedades disponibles en keys:');
Object.keys(keys).forEach(key => {
    console.log(`  - ${key}:`, typeof keys[key]);
});