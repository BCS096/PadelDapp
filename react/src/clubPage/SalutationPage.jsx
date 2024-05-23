import React from 'react';

const Bienvenida = ({ image, name }) => {
  const imageStyle = {
    width: '250px',  // Anchura fija
    height: '250px', // Altura fija
    objectFit: 'cover', // Ajustar la imagen dentro del contenedor
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <img src={image} alt={`Imagen de ${name}`} style={imageStyle} />
      <h1>Bienvenido {name}!</h1>
    </div>
  );
};

export default Bienvenida;