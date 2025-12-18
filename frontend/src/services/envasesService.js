import { api } from './apiConfig';

export const envasesService = {
  // Crear ticket (lo que debe recibir)
  async crearTicket(ticketData) {
    try {
      const response = await api.post('/envases/tickets', ticketData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Crear recepción (lo que realmente recibió)
  async crearRecepcion(recepcionData) {
    try {
      const response = await api.post('/envases/recepcion', recepcionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener resumen por fecha
  async getResumenRutas(fecha) {
    try {
      const response = await api.get(`/envases/resumen-rutas?fecha=${fecha}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};