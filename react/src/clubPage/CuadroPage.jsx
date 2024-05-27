// FilesContent.js
import React from 'react';
import { Link } from 'react-router-dom';

const TorneosActivosPage = ({ addressTorneo }) => {
  return (
    <div>
      <h1>Contenido del cuadro</h1>
      <p> {addressTorneo} </p>
    </div>
    
  );
};

export default TorneosActivosPage;
