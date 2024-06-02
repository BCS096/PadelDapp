import React, { useEffect } from 'react';
import TorneosTable from './TorneosTable';
import { PadelDBService } from '../services/PadelDBService';
import { useWeb3 } from '../Web3Provider';
import { Divider } from 'antd';

const MisTorneosPage = () => {

    const padelDBService = new PadelDBService();
    const { account } = useWeb3();
    const [torneos, setTorneos] = React.useState([]);

    useEffect( () => {
        if (account != '') {
             padelDBService.getTorneosActivos(account).then((torneos) => {    
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
                    <h1>Torneos disponibles</h1>
                </div>
                <Divider className='divider' />
                <div className='table-div'>
                    <TorneosTable torneos={torneos} setTorneos={setTorneos} />
                </div>
            </div>
        </div>
    );
};

export default MisTorneosPage;
