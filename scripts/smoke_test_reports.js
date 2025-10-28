// Pequeña prueba de humo para el modelo reports
require('dotenv').config();

(async () => {
  try {
    const model = require('../src/models/reports');

    console.log('Creando reporte de prueba...');
    const created = await model.create({ title: 'Prueba', description: 'Descripción de prueba' });
    console.log('Creado:', created);

    console.log('Listando reportes...');
    const list = await model.list();
    console.log('Listado:', list);

    console.log('Actualizando reporte...');
    const updated = await model.update(created.id, { status: 'resolved' });
    console.log('Actualizado:', updated);

    console.log('Smoke test OK');
    process.exit(0);
  } catch (err) {
    console.error('Smoke test falló:', err);
    process.exit(2);
  }
})();