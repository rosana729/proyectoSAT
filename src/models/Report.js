/**
 * Modelo de Reporte
 * Maneja operaciones CRUD para la tabla reports en Supabase
 * @author SAT Project Team
 */

import { supabase } from '../config/database.js';

/**
 * Modelo Report para interactuar con la tabla reports
 */
export const Report = {
  /**
   * Crear un nuevo reporte de inspección
   * @param {Object} reportData - Datos del reporte
   * @returns {Object|null} Reporte creado o null si hay error
   */
  async create(reportData) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([{
          user_id: reportData.user_id,
          extinguisher_id: reportData.extinguisher_id,
          inspection_date: reportData.inspection_date,
          status: reportData.status,
          observations: reportData.observations || null,
          pressure_level: reportData.pressure_level || null,
          external_condition: reportData.external_condition || null,
          seal_condition: reportData.seal_condition || null,
          location_accessible: reportData.location_accessible || true
        }])
        .select(`
          *,
          extinguisher:extinguishers(serial_number, type, location),
          user:users(full_name, email)
        `)
        .single();

      if (error) {
        console.error('Error creando reporte:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error en Report.create:', err);
      return null;
    }
  },

  /**
   * Buscar reporte por ID
   * @param {string} id - ID del reporte
   * @returns {Object|null} Reporte encontrado o null
   */
  async findById(id) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          extinguisher:extinguishers(serial_number, type, location, capacity),
          user:users(full_name, email)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error buscando reporte por ID:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error en Report.findById:', err);
      return null;
    }
  },

  /**
   * Buscar reportes por usuario
   * @param {string} userId - ID del usuario
   * @param {number} limit - Límite de resultados
   * @param {number} page - Página actual
   * @returns {Array} Lista de reportes del usuario
   */
  async findByUser(userId, limit = 10, page = 1) {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          extinguisher:extinguishers(serial_number, type, location)
        `)
        .eq('user_id', userId)
        .range(offset, offset + limit - 1)
        .order('inspection_date', { ascending: false });

      if (error) {
        console.error('Error buscando reportes por usuario:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error en Report.findByUser:', err);
      return [];
    }
  },

  /**
   * Buscar reportes por extintor
   * @param {string} extinguisherId - ID del extintor
   * @returns {Array} Lista de reportes del extintor
   */
  async findByExtinguisher(extinguisherId) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          user:users(full_name, email)
        `)
        .eq('extinguisher_id', extinguisherId)
        .order('inspection_date', { ascending: false });

      if (error) {
        console.error('Error buscando reportes por extintor:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error en Report.findByExtinguisher:', err);
      return [];
    }
  },

  /**
   * Buscar reportes por fecha
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {Array} Lista de reportes de la fecha especificada
   */
  async findByDate(date) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          extinguisher:extinguishers(serial_number, type, location),
          user:users(full_name, email)
        `)
        .eq('inspection_date', date)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error buscando reportes por fecha:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error en Report.findByDate:', err);
      return [];
    }
  },

  /**
   * Buscar reportes recientes
   * @param {number} limit - Límite de resultados
   * @returns {Array} Lista de reportes más recientes
   */
  async findRecent(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          extinguisher:extinguishers(serial_number, type, location),
          user:users(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error buscando reportes recientes:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error en Report.findRecent:', err);
      return [];
    }
  },

  /**
   * Actualizar reporte
   * @param {string} id - ID del reporte
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object|null} Reporte actualizado o null
   */
  async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          extinguisher:extinguishers(serial_number, type, location),
          user:users(full_name, email)
        `)
        .single();

      if (error) {
        console.error('Error actualizando reporte:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error en Report.update:', err);
      return null;
    }
  },

  /**
   * Eliminar reporte
   * @param {string} id - ID del reporte
   * @returns {boolean} true si se eliminó, false si hubo error
   */
  async delete(id) {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error eliminando reporte:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error en Report.delete:', err);
      return false;
    }
  },

  /**
   * Obtener todos los reportes (para administradores)
   * @param {number} limit - Límite de resultados
   * @param {number} page - Página actual
   * @returns {Array} Lista de todos los reportes
   */
  async findAll(limit = 50, page = 1) {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          extinguisher:extinguishers(serial_number, type, location),
          user:users(full_name, email)
        `)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo todos los reportes:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error en Report.findAll:', err);
      return [];
    }
  },

  /**
   * Contar reportes por usuario
   * @param {string} userId - ID del usuario
   * @returns {number} Número de reportes del usuario
   */
  async countByUser(userId) {
    try {
      const { count, error } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        console.error('Error contando reportes por usuario:', error);
        return 0;
      }

      return count || 0;
    } catch (err) {
      console.error('Error en Report.countByUser:', err);
      return 0;
    }
  },

  /**
   * Contar total de reportes
   * @returns {number} Número total de reportes
   */
  async count() {
    try {
      const { count, error } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error contando reportes:', error);
        return 0;
      }

      return count || 0;
    } catch (err) {
      console.error('Error en Report.count:', err);
      return 0;
    }
  },

  /**
   * Obtener estadísticas de reportes por usuario
   * @param {string} userId - ID del usuario
   * @returns {Object} Estadísticas del usuario
   */
  async getUserStats(userId) {
    try {
      const [totalReports, recentReports] = await Promise.all([
        this.countByUser(userId),
        this.findByUser(userId, 5, 1)
      ]);

      // Contar reportes por estado
      const { data: statusData, error: statusError } = await supabase
        .from('reports')
        .select('status')
        .eq('user_id', userId);

      if (statusError) {
        console.error('Error obteniendo estadísticas de estado:', statusError);
      }

      const statusCounts = (statusData || []).reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
      }, {});

      return {
        totalReports,
        recentReports,
        statusCounts,
        thisMonth: await this.countByUserAndMonth(userId, new Date())
      };
    } catch (err) {
      console.error('Error en Report.getUserStats:', err);
      return {
        totalReports: 0,
        recentReports: [],
        statusCounts: {},
        thisMonth: 0
      };
    }
  },

  /**
   * Contar reportes por usuario en un mes específico
   * @param {string} userId - ID del usuario
   * @param {Date} date - Fecha del mes a contar
   * @returns {number} Número de reportes en el mes
   */
  async countByUserAndMonth(userId, date) {
    try {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const { count, error } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('inspection_date', startOfMonth.toISOString().split('T')[0])
        .lte('inspection_date', endOfMonth.toISOString().split('T')[0]);

      if (error) {
        console.error('Error contando reportes por mes:', error);
        return 0;
      }

      return count || 0;
    } catch (err) {
      console.error('Error en Report.countByUserAndMonth:', err);
      return 0;
    }
  }
};