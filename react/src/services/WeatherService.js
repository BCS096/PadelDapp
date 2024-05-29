import axios from 'axios';

export class WeatherService {

    constructor() {}
    
    async getTiempo(direccion) {
        try {
            return await axios.post('http://localhost:3001/weather', { direccion: direccion });
        } catch (error) {
            console.error('Error al obtener el tiempo:', error);
        }
    }


}

const a = new WeatherService();
a.getTiempo('Pollensa').then(console.log);