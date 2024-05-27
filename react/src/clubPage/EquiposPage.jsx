// FilesContent.js
import React from 'react';
import { Link } from 'react-router-dom';

const TorneosActivosPage = ({ addressTorneo }) => {
  return (
    <div>
      <h1>Contenido de los Equipos</h1>
      <p>{addressTorneo}</p>
      <Link to="/files">Ir a Opción 1</Link>
    </div>
    
  );
};

export default TorneosActivosPage;
