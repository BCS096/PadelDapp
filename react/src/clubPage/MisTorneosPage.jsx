import React, { useEffect } from 'react';
import MisTorneosTable from './MisTorneosTable';
import { PadelDBService } from '../services/PadelDBService';
import { useWeb3 } from '../Web3Provider';
import { Divider } from 'antd';
import { Routes, Route } from 'react-router-dom';
import './MisTorneosPage.css';
import PartidosPage from './PartidosPage';
import CuadroPage from './CuadroPage';
import EquiposPage from './EquiposPage';

const MisTorneosPage = () => {

  const padelDBService = new PadelDBService();
  const { account } = useWeb3();
  const [torneos, setTorneos] = React.useState([]);

  useEffect(() => {
    if (account != '') {
      padelDBService.getTorneosByOwner(account).then((torneos) => {
        torneos.forEach((torneo) => {
          torneo.key = torneo.address;
        });
        setTorneos(torneos);
      });
    }
  }, [account]);

  return (
      <Routes>
        <Route path="partidos" element={<PartidosPage />} />
        <Route path="cuadro" element={<CuadroPage />} />
        <Route path="jugadores" element={<EquiposPage />} />
        <Route
          path="*"
          element={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
              }}
            >
              <div
                style={{
                  flex: '1 1 auto',
                  padding: 24,
                  overflow: 'auto',
                }}
              >
                <div className="mis-torneos-title">
                  <h1>Mis Torneos</h1>
                </div>
                <Divider className='divider' />
                <div className='table-div'>
                  <MisTorneosTable torneos={torneos} setTorneos={setTorneos} />
                </div>
              </div>
            </div>
          }
        />
      </Routes>
  );
};

export default MisTorneosPage;
