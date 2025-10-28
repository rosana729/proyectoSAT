/**
 * Modelo de Usuario
 * Maneja operaciones CRUD para la tabla users en Supabase
 * @author SAT Project Team
 */

import { supabase, supabaseAdmin } from '../config/database.js';

/**
 * Modelo User para interactuar con la tabla users
 */
export const User = {
  /**
   * Crear un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Object|null} Usuario creado o null si hay error
   */
  async create(userData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([{
          email: userData.email,
          password: userData.password,
          full_name: userData.full_name,
          role: userData.role || 'user'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creando usuario:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error en User.create:', err);
      return null;
    }
  },

  /**
   * Buscar usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error buscando usuario por ID:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error en User.findById:', err);
      return null;
    }
  },

  /**
   * Buscar usuario por email
   * @param {string} email - Email del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - usuario no encontrado
          return null;
        }
        console.error('Error buscando usuario por email:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error en User.findByEmail:', err);
      return null;
    }
  },

  /**
   * Actualizar usuario
   * @param {string} id - ID del usuario
   * @param {Object} updateData - Datos a actualizar
   * @returns {Object|null} Usuario actualizado o null
   */
  async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error actualizando usuario:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error en User.update:', err);
      return null;
    }
  },

  /**
   * Eliminar usuario
   * @param {string} id - ID del usuario
   * @returns {boolean} true si se eliminó, false si hubo error
   */
  async delete(id) {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error eliminando usuario:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error en User.delete:', err);
      return false;
    }
  },

  /**
   * Obtener todos los usuarios (solo para administradores)
   * @param {number} limit - Límite de resultados
   * @param {number} page - Página actual
   * @returns {Array} Lista de usuarios
   */
  async findAll(limit = 50, page = 1) {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, created_at, updated_at')
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo usuarios:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error en User.findAll:', err);
      return [];
    }
  },

  /**
   * Contar total de usuarios
   * @returns {number} Número total de usuarios
   */
  async count() {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error contando usuarios:', error);
        return 0;
      }

      return count || 0;
    } catch (err) {
      console.error('Error en User.count:', err);
      return 0;
    }
  },

  /**
   * Buscar usuarios por rol
   * @param {string} role - Rol a buscar
   * @returns {Array} Lista de usuarios con el rol especificado
   */
  async findByRole(role) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, created_at')
        .eq('role', role)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error buscando usuarios por rol:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Error en User.findByRole:', err);
      return [];
    }
  },

  /**
   * Verificar si un email ya está en uso
   * @param {string} email - Email a verificar
   * @param {string} excludeId - ID de usuario a excluir de la búsqueda
   * @returns {boolean} true si el email está en uso, false si no
   */
  async emailExists(email, excludeId = null) {
    try {
      let query = supabase
        .from('users')
        .select('id')
        .eq('email', email);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - email no está en uso
          return false;
        }
        console.error('Error verificando email:', error);
        return false;
      }

      return data !== null;
    } catch (err) {
      console.error('Error en User.emailExists:', err);
      return false;
    }
  },

  /**
   * Actualizar última fecha de login
   * @param {string} id - ID del usuario
   * @returns {boolean} true si se actualizó, false si hubo error
   */
  async updateLastLogin(id) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error actualizando último login:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error en User.updateLastLogin:', err);
      return false;
    }
  }
};