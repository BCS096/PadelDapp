import axios from 'axios';

export class PadelDBService {
  constructor() {
    this.backendUrl = 'http://localhost:3000';
  }

  async obtenerRegistros() {
    try {
      const response = await axios.get(`${this.backendUrl}/api/data`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los registros:', error);
      throw error;
    }
  }

}
