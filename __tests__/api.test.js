const request = require('supertest');
const app = require('../src/app');  // necesitaremos extraer app de index.js
const reportsModel = require('../src/models/reports');

// Mock del módulo database para tests
jest.mock('../src/config/database', () => ({
  client: null,
  getClient: () => {
    throw new Error('Supabase client not initialized');
  }
}));

describe('API endpoints', () => {
  let testReport;

  beforeEach(async () => {
    // Crear un reporte de prueba usando el mock (caerá al mock en memoria)
    testReport = await reportsModel.create({
      title: 'Test Report',
      description: 'Test Description'
    });
  });

  describe('GET /api/reports', () => {
    it('debería listar los reportes', async () => {
      const res = await request(app)
        .get('/api/reports')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.ok).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      
      const report = res.body.data[0];
      expect(report).toHaveProperty('id');
      expect(report).toHaveProperty('title');
      expect(report).toHaveProperty('description');
      expect(report).toHaveProperty('status');
      expect(report).toHaveProperty('created_at');
      expect(report).toHaveProperty('updated_at');
    });
  });

  describe('POST /api/reports', () => {
    it('debería crear un nuevo reporte', async () => {
      const newReport = {
        title: 'New Report',
        description: 'New Description'
      };

      const res = await request(app)
        .post('/api/reports')
        .send(newReport)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body.ok).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe(newReport.title);
      expect(res.body.data.description).toBe(newReport.description);
      expect(res.body.data.status).toBe('pending');
    });

    it('debería retornar 400 si faltan campos requeridos', async () => {
      const res = await request(app)
        .post('/api/reports')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body.ok).toBe(false);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/reports/:id', () => {
    it('debería actualizar un reporte existente', async () => {
      const updates = {
        title: 'Updated Title',
        status: 'resolved'
      };

      const res = await request(app)
        .put(`/api/reports/${testReport.id}`)
        .send(updates)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.ok).toBe(true);
      expect(res.body.data.id).toBe(testReport.id);
      expect(res.body.data.title).toBe(updates.title);
      expect(res.body.data.status).toBe(updates.status);
      expect(new Date(res.body.data.updated_at)).toBeInstanceOf(Date);
    });

    it('debería retornar 404 si el reporte no existe', async () => {
      const res = await request(app)
        .put('/api/reports/nonexistent-id')
        .send({ title: 'New Title' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body.ok).toBe(false);
      expect(res.body).toHaveProperty('error');
    });
  });
});