import axios from 'axios';

export class PadelDBService {
  constructor() {
    this.backendUrl = 'http://localhost:3000';
  }

  async getClubs() {
    try {
      const response = await axios.get(`${this.backendUrl}/api/clubs`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los clubs:', error);
      throw error;
    }
  }

  async isNuevoUsuario(address) {
    try {
      const response = await axios.get(`${this.backendUrl}/api/usuario/${address}`);
      if (response.data) return false;
      const response2 = await axios.get(`${this.backendUrl}/api/club/${address}`);
      if (response2.data) return false;
      return true;
    } catch (error) {
      console.error('Error al comprobar si es un nuevo usuario:', error);
      throw error;
    }
  }

  async añadirTorneo(data) {
    try {
      await axios.post(`${this.backendUrl}/api/torneo`, data);
    } catch (error) {
      console.error('Error al añadir el torneo:', error);
      throw error;
    }
  }

  async añadirUsuario(data) {
    try {
      await axios.post(`${this.backendUrl}/api/usuario`, data);
    } catch (error) {
      console.error('Error al añadir el usuario:', error);
      throw error;
    }
  }

  async updateUsuario(address, data) {
    try {
      await axios.put(`${this.backendUrl}/api/usuario/${address}`, data);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      throw error;
    }
  }

  async añadirParticipacion(data) {
    try {
      await axios.post(`${this.backendUrl}/api/participacion`, data);
    } catch (error) {
      console.error('Error al añadir la participación:', error);
      throw error;
    }
  }

  async cancelarParticipacion(jugadorAddress, torneoAddress) {
    try {
      await axios.delete(`${this.backendUrl}/api/participacion/${jugadorAddress}/torneo/${torneoAddress}`);
    } catch (error) {
      console.error('Error al cancelar la participación:', error);
      throw error;
    }
  }

  async updateTorneoStatus(address, status){
    try {
      await axios.put(`${this.backendUrl}/api/torneo/${address}/status`, status);
    } catch (error) {
      console.error('Error al actualizar el estado del torneo:', error);
      throw error;
    }
  }

  async getTorneosByOwner(ownerAddress){
    try {
      const response = await axios.get(`${this.backendUrl}/api/torneo/owner/${ownerAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los torneos por propietario:', error);
      throw error;
    }
  }

  async getTorneosByJugador(jugadorAddress){
    try {
      const response = await axios.get(`${this.backendUrl}/api/torneo/jugador/${jugadorAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los torneos por jugador:', error);
      throw error;
    }
  }

  async getUsuario(address){
    try {
      const response = await axios.get(`${this.backendUrl}/api/usuario/${address}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      throw error;
    }
  }

  async getUsuariosByTorneo(torneoAddress){
    try {
      const response = await axios.get(`${this.backendUrl}/api/usuario/torneo/${torneoAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los usuarios por torneo:', error);
      throw error;
    }
  }

  async getTorneosActivos(){
    try {
      const response = await axios.get(`${this.backendUrl}/api/torneo/activos`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los torneos activos:', error);
      throw error;
    }
  }

}