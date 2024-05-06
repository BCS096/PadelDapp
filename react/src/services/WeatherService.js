export class WeatherService {

    constructor() {
        this.apiKey = '598a45ea6dd5cf5f91f03b503538d27e';
    }
    
    async getTiempo(direccion) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${direccion}&appid=${this.apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }


}

const a = new WeatherService();
a.getTiempo('Pollensa').then(console.log);