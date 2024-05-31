import React, { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { Col, Layout, Menu, Row, theme } from 'antd';
import CreateTorneoPage from './CreateTorneoPage';
import MisTorneosPage from './MisTorneosPage';
import PersonalDataPage from './PersonalDataPage';
import { GiTennisBall } from "react-icons/gi";
import MainImage from './MainImage';
import { useWeb3 } from '../Web3Provider';
import { PadelDBService } from '../services/PadelDBService';
import { PadelTokenService } from '../services/PadelTokenService';
import { useNavigate } from 'react-router-dom';
import PadelTokenJSON from '../assets/contracts/PadelToken.json'
import SalutationPage from './SalutationPage';


const { Sider, Content } = Layout;

function getItem(label, key, icon, to) {
  return {
    key,
    icon,
    label: <Link to={to}>{label}</Link>,
  };
}

const items = [
  getItem('Crear Torneo', '1', <GiTennisBall />, 'crearTorneo'),
  getItem('Mis Torneos', '2', <GiTennisBall />, 'torneos'),
  getItem('Datos de contacto', '3', <GiTennisBall />, 'infoPersonal'),
];

const PDT_CONTRACT = "0x9cCE28475A3417882D95dba489Dd8C58F0E86d47";

const MainClubPage = () => {
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { account, web3 } = useWeb3();

  const [collapsed, setCollapsed] = useState(false);
  const [foto, setFoto] = useState('');
  const [clubName, setClubName] = useState('');
  const [padelTokenService, setPadelTokenService] = useState(null);
  const [pdt, setPdt] = useState(0);
  const [club, setClub] = useState({});
  const [clubDireccion, setClubDireccion] = useState('');

  const padelDBService = new PadelDBService();

  useEffect(() => {
    console.log('account', account);
    padelDBService.getClub(account).then((club) => {
      setClub(club);
      setFoto(club.foto);
      setClubName(club.nom);
      setClubDireccion(club.direccio);
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
          <MainImage image={foto} />
          <Row style={{ color: 'white', fontSize: '15px', fontWeight: 'bold', textAlign: 'center', margin: '5%', justifyContent: 'center' }}>
            {clubName}
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
            <Route path="crearTorneo" element={<CreateTorneoPage props={club} />} />
            <Route path="torneos/*" element={<MisTorneosPage />} />
            <Route path="infoPersonal" element={<PersonalDataPage imagen={foto} setFoto={setFoto} setClubName={setClubName} pdt={pdt} club={club} />} />
            <Route path="*" element={<SalutationPage image={foto} name={clubName} direccion={clubDireccion}/>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainClubPage;