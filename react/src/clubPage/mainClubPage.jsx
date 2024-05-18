import React, { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { Layout, Menu, Row, theme } from 'antd';
import Content1 from './Content1';
import Content2 from './Content2';
import FileContent from './FileContent';
import { GiTennisBall } from "react-icons/gi";
import MainImage from './MainImage';
import { useWeb3 } from '../Web3Provider';
import { PadelDBService } from '../services/PadelDBService';
import { useNavigate } from 'react-router-dom';


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
  getItem('Torneos activos', '9', <GiTennisBall />, 'torneos-activos'),
];

const MainClubPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { account } = useWeb3();

  const [foto, setFoto] = useState('');

  const padelDBService = new PadelDBService();
  const navigate = useNavigate();

  useEffect(() => {
    if( account === '') {
      navigate('/home')
    }
    console.log('account', account);
    padelDBService.getClub(account).then((club) => {
      setFoto(club.foto);
    });
  }, [account]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme='dark' collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Row justify="center" style={{ padding: '20px' }}>
          <MainImage image={foto} />
          {/* TODO: add club name and number of PDTs */}
        </Row>
        <Menu theme="dark" defaultSelectedKeys={['0']} mode="inline" items={items} />
      </Sider>
      <Layout className="site-layout" style={{ margin: '2%' }}>
        <Content
          style={{
            margin: '16px',
            padding: '24px',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            flex: 1,
          }}
        >
          <Routes>
            <Route path="crearTorneo" element={<Content1 />} />
            <Route path="torneos" element={<Content2 />} />
            <Route path="torneos-activos" element={<FileContent />} />
            <Route path="*" element={<Content1 />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainClubPage;