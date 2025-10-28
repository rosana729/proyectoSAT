/**
 * Modelo de Extintor
 * Maneja operaciones CRUD para la tabla extinguishers en Supabase
 * @author SAT Project Team
 */

import { supabase } from '../config/database.js';

/**
 * Modelo Extinguisher para interactuar con la tabla extinguishers
 */
export const Extinguisher = {
  /**
   * Crear un nuevo extintor
   * @param {Object} extinguisherData - Datos del extintor
   * @returns {Object|null} Extintor creado o null si hay error
   */
  async create(extinguisherData) {
    try {
      const { data, error } = await supabase
        .from('extinguishers')
        .insert([{
          serial_number: extinguisherData.serial_number,
          type: extinguisherData.type,
          location: extinguisherData.location,
          capacity: extinguisherData.capacity || null,
          manufacture_date: extinguisherData.manufacture_date || null,
          last_maintenance: extinguisherData.last_maintenance || null,
          next_maintenance: extinguisherData.next_maintenance || null,
          status: extinguisherData.status || 'active',
          building: extinguisherData.building || null,
          floor: extinguisherData.floor || null,
          zone: extinguisherData.zone || null
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creando extintor:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error en Extinguisher.create:', err);
      return null;
    }
  },

  /**
   * Buscar extintor por ID
   * @param {string} id - ID del extintor
   * @returns {Object|null} Extintor encontrado o null
   */
  async findById(id) {
    try {
      const { data, error } = await supabase
        .from('extinguishers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error buscando extintor por ID:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error en Extinguisher.findById:', err);
      return null;
    }
  },

  /**
   * Buscar extintor por número de serie
   * @param {string} serialNumber - Número de serie del extintor
   * @returns {Object|null} Extintor encontrado o null
   */
  async findBySerialNumber(serialNumber) {
    try {
      const { data, error } = await supabase
        .from('extinguishers')
        .select('*')
        .eq('serial_number', serialNumber)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - extintor no encontrado
          return null;
        }
        console.error('Error buscando extintor por número de serie:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error en Extinguisher.findBySerialNumber:', err);
      return null;
    }
  },

  /**
   * Obtener todos los extintores
   * @param {number} limit - Límite de resultados
   * @param {number} page - Página actual
   * @returns {Array} Lista de extintores
   */
  async findAll(limit = 50, page = 1) {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error } = await supabase
        .from('extinguishers')
        .select('*')
        .range(offset, offset + limit - 1)
        .order('serial_number', { ascending: true });

      if (error) {
        console.error('Error obteniendo extintores:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error en Extinguisher.findAll:', err);
      return [];
    }
  },

  /**
   * Buscar extintores por ubicación
   * @param {string} location - Ubicación a buscar
   * @returns {Array} Lista de extintores en la ubicación
   */
  async findByLocation(location) {
    try {
      const { data, error } = await supabase
        .from('extinguishers')
        .select('*')
        .ilike('location', `%${location}%`)
        .order('serial_number', { ascending: true });

      if (error) {
        console.error('Error buscando extintores por ubicación:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error en Extinguisher.findByLocation:', err);
      return [];
    }
  },

  /**
   * Buscar extintores por tipo
   * @param {string} type - Tipo de extintor
   * @returns {Array} Lista de extintores del tipo especificado
   */
  async findByType(type) {
    try {
      const { data, error } = await supabase
        .from('extinguishers')
        .select('*')
        .eq('type', type)
        .order('serial_number', { ascending: true });

      if (error) {
        console.error('Error buscando extintores por tipo:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error en Extinguisher.findByType:', err);
      return [];
    }
  },

  /**
   * Buscar extintores que requieren mantenimiento
   * @param {number} daysAhead - Días de anticipación (por defecto 30)
   * @returns {Array} Lista de extintores que requieren mantenimiento
   */
  async findMaintenanceDue(daysAhead = 30) {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + daysAhead);
      const futureDateString = futureDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('extinguishers')
        .select('*')
        .or(`next_maintenance.is.null,next_maintenance.lte.${futureDateString}`)
        .eq('status', 'active')
        .order('next_maintenance', { ascending: true });

      if (error) {
        console.error('Error buscando extintores con mantenimiento debido:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error en Extinguisher.findMaintenanceDue:', err);
      return [];
    }
  },

  /**
   * Buscar extintores por estado
   * @param {string} status - Estado a buscar
   * @returns {Array} Lista de extintores con el estado especificado
   */
  async findByStatus(status) {
    try {
      const { data, error } = await supabase
        .from('extinguishers')
        .select('*')
        .eq('status', status)
        .order('serial_number', { ascending: true });

      if (error) {
        console.error('Error buscando extintores por estado:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error en Extinguisher.findByStatus:', err);
      return [];
    }
  },

  /**
   * Actualizar extintor
   * @param {string} id - ID del extintor
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object|null} Extintor actualizado o null
   */
  async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('extinguishers')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error actualizando extintor:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error en Extinguisher.update:', err);
      return null;
    }
  },

  /**
   * Actualizar fecha de último mantenimiento
   * @param {string} id - ID del extintor
   * @param {string} maintenanceDate - Fecha de mantenimiento
   * @param {string} nextMaintenanceDate - Fecha del próximo mantenimiento
   * @returns {Object|null} Extintor actualizado o null
   */
  async updateMaintenance(id, maintenanceDate, nextMaintenanceDate) {
    try {
      const { data, error } = await supabase
        .from('extinguishers')
        .update({
          last_maintenance: maintenanceDate,
          next_maintenance: nextMaintenanceDate,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error actualizando mantenimiento:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error en Extinguisher.updateMaintenance:', err);
      return null;
    }
  },

  /**
   * Eliminar extintor
   * @param {string} id - ID del extintor
   * @returns {boolean} true si se eliminó, false si hubo error
   */
  async delete(id) {
    try {
      const { error } = await supabase
        .from('extinguishers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error eliminando extintor:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error en Extinguisher.delete:', err);
      return false;
    }
  },

  /**
   * Contar total de extintores
   * @returns {number} Número total de extintores
   */
  async count() {
    try {
      const { count, error } = await supabase
        .from('extinguishers')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error contando extintores:', error);
        return 0;
      }

      return count || 0;
    } catch (err) {
      console.error('Error en Extinguisher.count:', err);
      return 0;
    }
  },

  /**
   * Contar extintores por estado
   * @returns {Object} Objeto con conteos por estado
   */
  async countByStatus() {
    try {
      const { data, error } = await supabase
        .from('extinguishers')
        .select('status');

      if (error) {
        console.error('Error contando extintores por estado:', error);
        return {};
      }

      const statusCounts = (data || []).reduce((acc, extinguisher) => {
        acc[extinguisher.status] = (acc[extinguisher.status] || 0) + 1;
        return acc;
      }, {});

      return statusCounts;
    } catch (err) {
      console.error('Error en Extinguisher.countByStatus:', err);
      return {};
    }
  },

  /**
   * Verificar si un número de serie ya existe
   * @param {string} serialNumber - Número de serie a verificar
   * @param {string} excludeId - ID de extintor a excluir de la búsqueda
   * @returns {boolean} true si el número de serie existe, false si no
   */
  async serialNumberExists(serialNumber, excludeId = null) {
    try {
      let query = supabase
        .from('extinguishers')
        .select('id')
        .eq('serial_number', serialNumber);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - número de serie no existe
          return false;
        }
        console.error('Error verificando número de serie:', error);
        return false;
      }

      return data !== null;
    } catch (err) {
      console.error('Error en Extinguisher.serialNumberExists:', err);
      return false;
    }
  },

  /**
   * Obtener estadísticas generales de extintores
   * @returns {Object} Estadísticas de extintores
   */
  async getStats() {
    try {
      const [total, statusCounts, maintenanceDue] = await Promise.all([
        this.count(),
        this.countByStatus(),
        this.findMaintenanceDue()
      ]);

      return {
        total,
        statusCounts,
        maintenanceDue: maintenanceDue.length,
        active: statusCounts.active || 0,
        inactive: statusCounts.inactive || 0,
        maintenance: statusCounts.maintenance || 0
      };
    } catch (err) {
      console.error('Error en Extinguisher.getStats:', err);
      return {
        total: 0,
        statusCounts: {},
        maintenanceDue: 0,
        active: 0,
        inactive: 0,
        maintenance: 0
      };
    }
  }
};