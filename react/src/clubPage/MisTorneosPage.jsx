// Option2Content.js
import React, { useEffect } from 'react';
import MisTorneosTable from './MisTorneosTable';
import { PadelDBService } from '../services/PadelDBService';
import { useWeb3 } from '../Web3Provider';
import { Divider } from 'antd';

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
          <MisTorneosTable data={torneos} />
        </div>
      </div>
    </div>
  );
};

export default MisTorneosPage;
