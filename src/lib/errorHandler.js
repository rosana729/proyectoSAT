// Middleware para manejo de errores
function notFound(req, res, next) {
  res.status(404);
  // responde con html si el cliente acepta html
  if (req.accepts('html')) return res.render('pages/404', { url: req.url });
  if (req.accepts('json')) return res.json({ error: 'Not found' });
  res.type('txt').send('Not found');
}

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500);
  if (req.accepts('json')) {
    return res.json({ 
      ok: false, 
      error: err.message 
    });
  }
  res.render('pages/error', { error: err });
}

module.exports = { notFound, errorHandler };
