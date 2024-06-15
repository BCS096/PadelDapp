import React from 'react';
import { Divider } from 'antd';
import VentaTokensCLubs from './VentaTokenClubs';
import VentaTokenCreator from './VentaTokenCreator';

function MainPlayerPage() {
    return (
        <>
        <div className='personal-player-div'>
                <div className="titulo" style={{ margin: '8%' }}>
                    <h1 className="title">Venta de PDTs</h1>
                    <h4>1 PDT = 0,00064 ETH</h4>
                </div>
                <Divider type="vertical" className="vertical-divider-cuadro" />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className='personal-player-box-div'>
                    <h1 className="title">Clubes</h1>
                    <VentaTokensCLubs />
                </div>
                <div className='personal-player-box-div'>
                    <h1 className="title">Creador PDT</h1>
                    <VentaTokenCreator />
                </div>
                </div>
            </div>
        </>
    );
}

export default MainPlayerPage;