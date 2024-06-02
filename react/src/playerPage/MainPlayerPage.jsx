import React, { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { Col, Layout, Menu, Row, theme } from 'antd';
import { GiTennisBall } from "react-icons/gi";
import { useWeb3 } from '../Web3Provider';
import { PadelDBService } from '../services/PadelDBService';
import { PadelTokenService } from '../services/PadelTokenService';
import PadelTokenJSON from '../assets/contracts/PadelToken.json'
import TorneosDisponibles from './TorneosDisponibles';
import MisTorneos from './MisTorneos';
import InfoPersonal from './InfoPersonal';
import VentaTokens from './VentaTokens';


const { Sider, Content } = Layout;

function getItem(label, key, icon, to) {
  return {
    key,
    icon,
    label: <Link to={to}>{label}</Link>,
  };
}

const items = [
  getItem('Torneos', '1', <GiTennisBall />, 'torneos'),
  getItem('Mis Torneos', '2', <GiTennisBall />, 'mis-torneos'),
  getItem('Datos de contacto', '3', <GiTennisBall />, 'info-personal'),
  getItem('Venta de PDTs', '4', <GiTennisBall />, 'venta-pdt'),
];

const PDT_CONTRACT = "0x9cCE28475A3417882D95dba489Dd8C58F0E86d47";

const MainPlayerPage = () => {
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { account, web3 } = useWeb3();

  const [collapsed, setCollapsed] = useState(false);
  const [padelTokenService, setPadelTokenService] = useState(null);
  const [pdt, setPdt] = useState(0);
  const [playerName, setPlayerName] = useState('');

  const padelDBService = new PadelDBService();

  useEffect(() => {
    console.log('account', account);
    padelDBService.getUsuario(account).then((player) => {
        setPlayerName(player.nombre);
    });
  }, [account]);

  useEffect(() => {
    if (web3 != null){ 
      console.log('web3', web3);
      console.log('account', account);
      const pdtContract = new web3.eth.Contract(PadelTokenJSON.abi, PDT_CONTRACT);
      setPadelTokenService(new PadelTokenService(pdtContract));
    }
    
  }, [web3]);

  useEffect(() => {
    if (padelTokenService != null) {
      padelTokenService.getBalanceOf(account).then((balance) => {
        setPdt(balance);
      });
    }
  }, [padelTokenService]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme='dark' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Col justify="center" align="middle" style={{ padding: '20px', background: '#002140'}}>
          <Row style={{ color: 'white', fontSize: '15px', fontWeight: 'bold', textAlign: 'center', margin: '5%', justifyContent: 'center' }}>
            {playerName}
          </Row>
          <Row style={{ color: 'white', fontSize: '15px', fontWeight: 'bold', textAlign: 'center', margin: '5%', justifyContent: 'center' }}>
            {pdt} PDT
          </Row>
        </Col>
        <Menu theme="dark" defaultSelectedKeys={['0']} mode="inline" items={items} />
      </Sider>
      <Layout style={{ margin: '2%'}}>
        <Content
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Routes>
            <Route path="torneos" element={<TorneosDisponibles />} />
            <Route path="mis-torneos" element={<MisTorneos />} />
            <Route path="info-personal" element={<InfoPersonal  />} />
            <Route path="venta-pdt" element={<VentaTokens />} />
            <Route path="*" element={<TorneosDisponibles />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainPlayerPage;