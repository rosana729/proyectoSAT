// Modelo para la tabla `reports`.
// Usa Supabase si `src/config/database.js` inicializó el cliente,
// en caso contrario cae a un mock en memoria (útil para desarrollo sin credenciales).
const db = require('../config/database');

// For development/testing you can force using the in-memory mock by setting
// FORCE_MOCK=1 or NODE_ENV=test. This avoids trying to reach Supabase when the
// table/schema isn't available locally.
const FORCE_MOCK = process.env.FORCE_MOCK === '1' || process.env.NODE_ENV === 'test';

// Mock en memoria
const _mock = {
  items: []
};

// Genera un UUID v4 para el mock
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function tryGetClient() {
  if (FORCE_MOCK) return null;
  try {
    return db.getClient();
  } catch (err) {
    return null;
  }
}

module.exports = {
  // devuelve la lista de reportes (Supabase o mock)
  async list() {
    const client = tryGetClient();
    if (client) {
      const { data, error } = await client.from('reports').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }

    // mock: devolver copia ordenada por created_at desc
    return [..._mock.items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // crea un reporte
  async create(payload) {
    const client = tryGetClient();
    if (client) {
      const { data, error } = await client.from('reports').insert([payload]).select().single();
      if (error) throw error;
      return data;
    }

    const now = new Date().toISOString();
    const record = Object.assign(
      { 
        id: uuidv4(), 
        status: 'pending',
        created_at: now, 
        updated_at: now 
      }, 
      payload
    );
    _mock.items.push(record);
    return record;
  },

  // actualiza un reporte por id
  async update(id, payload) {
    const client = tryGetClient();
    if (client) {
      const { data, error } = await client.from('reports').update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }

    const idx = _mock.items.findIndex(r => String(r.id) === String(id));
    if (idx === -1) {
      const err = new Error('Report not found');
      err.code = 'NOT_FOUND';
      throw err;
    }

    _mock.items[idx] = Object.assign({}, _mock.items[idx], payload, { updated_at: new Date().toISOString() });
    return _mock.items[idx];
  }
};
