import React, { useEffect } from 'react';
import { useState } from 'react';
import { Tabs } from 'antd';
import PartidosTable from './PartidosTable';
import { useWeb3 } from '../Web3Provider';
import { TorneoService } from '../services/TorneoService';
import TorneoJSON from '../assets/contracts/Torneo.json';
import { PadelDBService } from '../services/PadelDBService';
import './PartidosPage.css';
import { Divider } from 'antd';


const onChange = (key) => {
  console.log(key);
};

function calcularRondas(equipos) {
  let rondas = 0;
  let potenciaDeDos = 1;

  while (potenciaDeDos < equipos) {
    potenciaDeDos *= 2;
    rondas++;
  }

  return rondas;
}

function nombreRonda(numRonda) {
  if (numRonda === 5) {
    return "Dieciseisavos";
  } else if (numRonda === 3) {
    return "Octavos";
  } else if (numRonda === 2) {
    return "Cuartos";
  } else if (numRonda === 1) {
    return "Semifinal";
  } else if (numRonda === 0) {
    return "Final";
  }
  return "";
}

function buildPartidasPorRonda(partidos, equipos) {
  let partidasPorRonda = new Map();
  let i = 0;
  partidos.forEach((partido) => {
    if (!partidasPorRonda.has(partido.partida.ronda)) {
      partidasPorRonda.set(partido.partida.ronda, []);
    }
    const partida = { ...partido.partida };
    partida.idPartida = i;
    partida.key = i;
    const equipo1 = equipos.get(partido.partida.equipo1Id);
    const equipo2 = equipos.get(partido.partida.equipo2Id);
    partida.equipo1 = {
      jugador1: equipo1 ? equipo1.jugador1 : "",
      jugador1Id: equipo1 ? equipo1.jugador1Id : "",
      jugador2: equipo1 ? equipo1.jugador2 : "",
      jugador2Id: equipo1 ? equipo1.jugador2Id : ""
    }
    partida.equipo2 = {
      jugador1: equipo2 ? equipo2.jugador1 : "",
      jugador1Id: equipo2 ? equipo2.jugador1Id : "",
      jugador2: equipo2 ? equipo2.jugador2 : "",
      jugador2Id: equipo2 ? equipo2.jugador2Id : ""
    }
    partidasPorRonda.get(partido.partida.ronda).push(partida);
    i++;
  });
  return partidasPorRonda;
}



const TorneosActivosPage = () => {

  const [addressTorneo, setAddressTorneo] = useState("");
  const [partidos, setPartidos] = useState(new Map());
  const { web3 } = useWeb3();
  const [rondas, setRondas] = useState(0);
  const padelDBService = new PadelDBService();


  useEffect(() => {
    setAddressTorneo(localStorage.getItem("addressTorneo"));
  }, []);

  useEffect(() => {
    if (addressTorneo !== "" && web3) {
      const torneoContract = new web3.eth.Contract(TorneoJSON.abi, addressTorneo);
      const torneoService = new TorneoService(torneoContract);
      torneoService.getPartidas().then((partidos) => {
        torneoService.getEquipos().then((equipos) => {
          setRondas(calcularRondas(equipos.length));
          let rq = [];
          equipos.forEach((equipo) => {
            rq.push({ id: equipo.equipoId, jugador1: equipo.jugador1, jugador2: equipo.jugador2 });
          });
          padelDBService.getNombreJugadores(rq).then((nombres) => {
            const partidasPorRonda = buildPartidasPorRonda(partidos, nombres);
            setPartidos(partidasPorRonda);
          }).catch((error) => {
            console.error(error);
          });
        });
      });
    }
  }
    , [addressTorneo, web3]);

  const items = new Array(rondas).fill(null).map((_, i) => {
    return {
      label: nombreRonda(i),
      key: i,
      children: <PartidosTable datos={partidos.get(nombreRonda(i))} />,
    };
  }).reverse();

  return (
    <>
      <div className='partidos-div'>
        <div className="titulo-partidos">
          <h1 className="title">
            Partidas de
            <br />
            {localStorage.getItem("nombreTorneo")}
          </h1>
        </div>
        <div className="titulo-partidos" style={{ margin: '8%' }}>
          <Divider type="vertical" className="vertical-divider-partidos" />
        </div>
        <div className='table-partidos-div'>
          <Tabs
            onChange={onChange}
            type="card"
            items={items}
            defaultActiveKey={0}
          />
        </div>
      </div>
    </>
  );
};

export default TorneosActivosPage;
