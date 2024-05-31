import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../Web3Provider';
import { TorneoService } from '../services/TorneoService';
import TorneoJSON from '../assets/contracts/Torneo.json';
import { PadelDBService } from '../services/PadelDBService';
import EquiposTable from './EquiposTable';
import './EquiposPage.css';
import { Divider } from 'antd';

const App = () => {

  const [addressTorneo, setAddressTorneo] = useState("");
  const { web3 } = useWeb3();
  const [datos, setDatos] = useState(null);
  const padelDBService = new PadelDBService();

  useEffect(() => {
    setAddressTorneo(localStorage.getItem("addressTorneo"));
  }, []);

  useEffect(() => {
    const buildEquipos = async () => {
      const map = new Map();
      const equiposList = [];
      if (addressTorneo !== "" && web3) {
        const torneoContract = new web3.eth.Contract(TorneoJSON.abi, addressTorneo);
        const torneoService = new TorneoService(torneoContract);
        torneoService.getEquipos().then((equipos) => {
          equipos.forEach((equipo) => {
            equiposList.push(equipo.jugador1);
            equiposList.push(equipo.jugador2);
            map.set(equipo.jugador1, equipo.equipoId);
            map.set(equipo.jugador2, equipo.equipoId);
          });
          padelDBService.getJugadoresByAddress(equiposList).then((usuarios) => {
            let i = 0;
            usuarios.forEach((usuario) => {
              usuario.key = i++;
              usuario.equipo = map.get(usuario.address);
            });
            setDatos(usuarios);
          });

        });

      }
    };
    buildEquipos();

  }, [addressTorneo, web3]);

  return (
    <div className='equipos-div'>
      <div className="titulo-equipos">
        <h1 className="title">
          Jugadores de
          <br />
          {localStorage.getItem("nombreTorneo")}
        </h1>
      </div>
      <div className="titulo-equipos" style={{ margin: '8%' }}>
        <Divider type="vertical" className="vertical-divider-equipos" />
      </div>
      <div className='table-equipos-div'>
        <EquiposTable equipos={datos} />
      </div>
    </div>

  );
};
export default App;