import React, { useEffect } from 'react';
import { WeatherService } from '../services/WeatherService';

const Bienvenida = ({ image, name, direccion }) => {
  const imageStyle = {
    width: '250px',  // Anchura fija
    height: '250px', // Altura fija
    objectFit: 'cover', // Ajustar la imagen dentro del contenedor
  };
  const weatherService = new WeatherService();
  const [tiempo, setTiempo] = React.useState('');

  useEffect(() => {
    if (direccion != '') {
      weatherService.getTiempo(direccion).then((res) => {
        setTiempo(res);
      });
    }

  }, [direccion]);

  return (
    <>
      <div style={{ textAlign: 'center', margin: '20px' }}>
        <img src={image} alt={`Imagen de ${name}`} style={imageStyle} />
        <h1>Bienvenido {name}!</h1>
      </div>
      <img src={tiempo.image} alt={`Imagen del tiempo en ${direccion}`} style={imageStyle} />
      <div style={{display:'flex', flexDirection: 'column'}}>
        <h1>La temperatura es de {tiempo.temperatura} grados</h1>
        <h1>Y el viente es de {tiempo.viento} km/h</h1>
      </div>
      <div>

      </div>
    </>
  );
};

export default Bienvenida;