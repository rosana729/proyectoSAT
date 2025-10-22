const express = require('express');
const router = express.Router();

// Página Home - servir HTML estático para evitar errores de EJS y dejar la página visible
const path = require('path');
router.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'public', 'index.html');
  res.sendFile(indexPath);
});

// FAQ
router.get('/faq', (req, res) => {
  res.render('pages/faq', {
    title: 'SAT - Preguntas Frecuentes',
    description: 'Preguntas frecuentes sobre el Sistema de Alerta Temprana'
  });
});

module.exports = router;
