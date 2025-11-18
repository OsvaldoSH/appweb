import { api } from './apiConfig';

export const contratosService = {
    async getEmpleados() {
        try {
            const response = await api.get('/empleados/comodatos');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    async getClienteByClaveSive(clave) {
        try {
            const response = await api.get(`/cliente/clave/${clave}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null; //Cliente no encontrado
            }
            throw error.response?.data || error;
        }
    },

    async getEnfriadorBySerie(numeroSerie) {
        try {
            const response = await api.post(`/enfriadores/serie/${numeroSerie}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null; //Enfriador no encontrado update to 18/11/202
            }
            throw error.response?.data || error;
        }
    },

    async createComodato(comodatoData) {
        try {
            const response = await api.post('/comodatos', comodatoData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }

    },
};