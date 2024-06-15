import React, { useEffect, useRef } from 'react';
import './CuadroPage.css';
import { useWeb3 } from '../Web3Provider';
import TorneoJSON from '../assets/contracts/Torneo.json';
import { TorneoService } from '../services/TorneoService';
import { PadelDBService } from '../services/PadelDBService';
import { Divider } from 'antd';

function calcularRondas(equipos) {
  let rondas = 0;
  let potenciaDeDos = 1;

  while (potenciaDeDos < equipos) {
    potenciaDeDos *= 2;
    rondas++;
  }

  return rondas;
}

function numeroDePartidasByRonda(numRrondas) {
  if (numRrondas === 5) { // dieciseisavos
    return 16;
  } else if (numRrondas === 4) { // octavos
    return 8;
  } else if (numRrondas === 3) { // cuartos
    return 4;
  } else if (numRrondas === 2) { // semis
    return 2;
  } else if (numRrondas === 1) { // final
    return 1;
  }
  return 0;
}

function setWidth(rondas) {
  if (rondas === 5) {
    return 1000;
  } else if (rondas === 4) {
    return 875;
  } else if (rondas === 3) {
    return 650;
  } else if (rondas === 2) {
    return 450;
  } else if (rondas === 1) {
    return 250;
  }
  return 0;

}

function setHeight(rondas) {
  if (rondas === 5) {
    return 800;
  } else if (rondas === 4) {
    return 900;
  }
  else if (rondas === 3) {
    return 450;
  }
  else if (rondas === 2) {
    return 250;
  }
  else if (rondas === 1) {
    return 150;
  }
  return 0;
}


const TorneoCanvas = () => {
  const canvasRef = useRef(null);
  const { web3 } = useWeb3();
  const [equipos, setEquipos] = React.useState([]);
  const [cuadro, setCuadro] = React.useState([]);
  const [nombres, setnombres] = React.useState(new Map());
  const padelDBService = new PadelDBService();
  const [nombreTorneo, setNombreTorneo] = React.useState('');
  const [address, setAddress] = React.useState('');

  useEffect(() => {
    setNombreTorneo(localStorage.getItem('nombreTorneo'));
    setAddress(localStorage.getItem('addressTorneo'));
  }, []);

  useEffect(() => {
    if (web3 && address != '') {
      const torneoContract = new web3.eth.Contract(TorneoJSON.abi, address);
      const torneoService = new TorneoService(torneoContract);
      torneoService.getPartidas().then((partidos) => {
        setCuadro(partidos);
      });
      torneoService.getEquipos().then((equipos) => {
        let rq = [];
        equipos.forEach((equipo) => {
          rq.push({ id: equipo.equipoId, jugador1: equipo.jugador1, jugador2: equipo.jugador2 });
        });
        padelDBService.getNombreJugadores(rq).then((nombres) => {
          setnombres(nombres);
        }).catch((error) => {
          console.error(error);
        });
        setEquipos(equipos);
      });
    }
  }, [web3, address]);

  useEffect(() => {
    if (equipos.length != 0 && cuadro.length != 0 && nombres.size != 0) {
      console.log('equipos', equipos);
      console.log('partidas', cuadro);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      let x = 50;
      let y = 50;
      let anchura = 170;
      let altura = 50;
      let separacion = 100;
      let rondas = calcularRondas(equipos.length);
      let partidas = numeroDePartidasByRonda(rondas);
      let it = 0;
      let primeraRonda = true;
      for (let i = 0; i < rondas; i++) { //for de rondas
        let aux = y;
        for (let j = 0; j < partidas; j++) { // for de partidos
          ctx.fillStyle = ' rgb(0, 33, 64)';
          ctx.fillRect(x, aux, anchura, altura);
          ctx.fillStyle = '#ffff';
          ctx.fillRect(x, aux + altura / 2, anchura, 2);
          let equipo1 = nombres.get(cuadro[it].partida.equipo1Id);
          let equipo2 = nombres.get(cuadro[it].partida.equipo2Id);
          ctx.font = '12px Arial';
          if (equipo1 == undefined) {
            const descripcion = primeraRonda ? 'Bye' : "";
            ctx.fillText(descripcion, x + 5, aux + altura / 4 + 5);
          } else {
            ctx.fillText(`${equipo1.jugador1} / ${equipo1.jugador2}`, x + 5, aux + altura / 4 + 5);
          }
          if (equipo2 == undefined) {
            const descripcion = primeraRonda ? 'Bye' : "";
            ctx.fillText(descripcion, x + 5, aux + altura / 2 + altura / 4 + 5);
          } else {
            ctx.fillText(`${equipo2.jugador1} / ${equipo2.jugador2}`, x + 5, aux + altura / 2 + altura / 4 + 5);
          }
          it++;
          aux += separacion;
        }
        x += 200;
        partidas /= 2;
        y = y + separacion / 2;
        separacion = separacion * 2;
        primeraRonda = false;
      }
    }
  }, [equipos, cuadro, nombres]);

  return (
    <>
      <div className="titulo" style={{ margin: '8%' }}>
        <h1 className="title">Cuadro de {nombreTorneo}</h1>
      </div>
      <Divider type="vertical" className="vertical-divider-cuadro" />
        <canvas
          ref={canvasRef}
          id="torneoCanvas"
          width={setWidth(calcularRondas(equipos.length))}
          height={setHeight(calcularRondas(equipos.length))}
        >
        </canvas>
    </>
  );
}

export default TorneoCanvas;
