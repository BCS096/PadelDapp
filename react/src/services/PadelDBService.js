import axios from 'axios';
import FormData from 'form-data';

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

  async getClub(address) {
    try {
      const response = await axios.get(`${this.backendUrl}/api/club/${address}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el club:', error);
      throw error;
    }
  }

  async añadirClub(values) {
    const formData = new FormData();
    formData.append('imagen', values.imagen);
    try {
        const response = await axios.post(`${this.backendUrl}/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data', 
            }
        });
        values.imagen = response.data.filename;
        await axios.post(`${this.backendUrl}/api/club`, values);


    } catch (error) {
        console.error('Error al cargar la imagen:', error);
    }
 }

  async actualizarImagenClub(address, imagen) {
    const formData = new FormData();
    formData.append('imagen', imagen);
    try {
      const response = await axios.post(`${this.backendUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        }
    });
    imagen = response.data.filename;
    await this.updateClub(address, { imagen });
    return "http://localhost:3000/images/" + imagen;
    } catch (error) {
      console.error('Error al actualizar la imagen del club:', error);
      throw error;
    }
  }

  async isJugador(address) {
    try {
      const response = await axios.get(`${this.backendUrl}/api/usuario/${address}`);
      if (response.data) return true;
      return false;
    } catch (error) {
      console.error('Error al comprobar si es un jugador:', error);
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

  async updateClub(address, data) {
    try {
      await axios.put(`${this.backendUrl}/api/club/${address}`, data);
    } catch (error) {
      console.error('Error al actualizar el club:', error);
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
      console.log('status', status);
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

  async getNombreJugadores(equipos) {
    try {
      let names = new Map();
      for (let i = 0; i < equipos.length; i++) {
        const jugador1 = await this.getUsuario(equipos[i].jugador1);
        const jugador2 = await this.getUsuario(equipos[i].jugador2);
        console.log('e',equipos)
        names.set(equipos[i].id, {
          jugador1: jugador1.nombre,
          jugador1Id: equipos[i].jugador1,
          jugador2: jugador2.nombre,
          jugador2Id: equipos[i].jugador2
        });
      }
      return names;
    } catch (error) {
      console.error('Error al obtener los nombres de los jugadores:', error);
      throw error;
    }
  }

  async getEmailJugadores(partida) {
    try {
      let emails = [];
      const jugador1 = await this.getUsuario(partida.equipo1.jugador1Id);
      const jugador2 = await this.getUsuario(partida.equipo1.jugador2Id);
      const jugador3 = await this.getUsuario(partida.equipo2.jugador1Id);
      const jugador4 = await this.getUsuario(partida.equipo2.jugador2Id);
      emails.push({email: jugador1.email, nombre: jugador1.nombre});
      emails.push({email: jugador2.email, nombre: jugador2.nombre});
      emails.push( {email: jugador3.email, nombre: jugador3.nombre});
      emails.push({email: jugador4.email, nombre: jugador4.nombre});
      return emails;
    } catch (error) {
      console.error('Error al obtener los emails de los jugadores:', error);
      throw error;
    }
  }

  async getJugadoresByAddress(addresses) {
    try {
      console.log('addresses', addresses);
      const res = await axios.post(`${this.backendUrl}/api/usuarios`, addresses);
      return res.data;
    } catch (error) {
      console.error('Error al obtener los jugadores por dirección:', error);
      throw error;
    }
  }

}