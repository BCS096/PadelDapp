import axios from 'axios';

export class WeatherService {

    constructor() {}
    
    async getTiempo(direccion) {
        try {
            const res = await axios.post('http://localhost:3001/weather', { direccion: direccion });
            const image = `https://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`;
            const temperatura = (res.data.main.temp - 273.15).toFixed(1); 
            const viento = (res.data.wind.speed * 3.6).toFixed(1);

            return { temperatura, viento, image };
            
        } catch (error) {
            console.error('Error al obtener el tiempo:', error);
        }
    }


}
