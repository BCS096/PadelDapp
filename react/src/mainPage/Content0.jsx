import React from 'react';
import { Row, Col } from 'antd';
import './Content0.css';
import metamask from './metamask.webp';

function Content0(props) {
  return (
    <div {...props} className='home-page-wrapper content0-wrapper transparent'>
      <div className='home-page content0'>
        <div className='rounded-box'>
          <div className='title-metamask'>
            <h1>Metamask</h1>
          </div>
          <Row>
            <Col span={12} className='content0-metamask'>
              <img src={metamask} alt='.metamask'></img>
            </Col>
            <Col span={12} className='content0-metamask'>
              <p>
                MetaMask es una extensión de navegador que actúa como una billetera digital y una interfaz de usuario para interactuar con aplicaciones descentralizadas (dApps) en la red Ethereum. Permite a los usuarios gestionar criptomonedas, realizar transacciones seguras y acceder a servicios descentralizados directamente desde su navegador web.
                Por favor, tenga en cuenta que para utilizar nuestra aplicación, es necesario tener instalada la extensión MetaMask en su navegador.
              </p>
            </Col>
          </Row>
        </div>

      </div>
    </div>
  );
}

export default Content0;
