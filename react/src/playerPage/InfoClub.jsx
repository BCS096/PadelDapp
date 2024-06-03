import React, { useEffect } from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { PadelDBService } from '../services/PadelDBService';
import { WeatherService } from '../services/WeatherService';

const { Title, Text } = Typography;

const UserProfile = () => {

  const [userInfo, setUserInfo] = useState({});
  const padelDBService = new PadelDBService();
  const weatherService = new WeatherService();

  useEffect(() => {
    padelDBService.getOwner(localStorage.getItem('addressTorneo')).then((userInfo) => {
      weatherService.getTiempo(userInfo.direccio).then((tiempo) => {
        setUserInfo({
          name: userInfo.nom,
          address: userInfo.direccio,
          phone: userInfo.telefono,
          email: userInfo.email,
          imageUrl: userInfo.foto,
          tiempo: tiempo.image,
          temperature: tiempo.temperatura,
          wind: tiempo.viento
        });
      });
    });
  }, []);



  return (
    <Card>
      <Row gutter={16}>
        <Col span={12}>
          <Title level={4}>Información del club organizador</Title>
          <Text strong>Nombre:</Text> <Text>{userInfo.name}</Text><br />
          <Text strong><EnvironmentOutlined /> Dirección:</Text> <Text>{userInfo.address}</Text><br />
          <Text strong><PhoneOutlined /> Teléfono:</Text> <Text>{userInfo.phone}</Text><br />
          <Text strong><MailOutlined /> Email:</Text> <Text>{userInfo.email}</Text><br />
          <img src={userInfo.imageUrl} alt="Profile" style={{ width: '100%', marginBottom: '16px' }} />
        </Col>
        <Col span={12}>
          <Title level={4}>Tiempo Actual</Title>
          <img src={userInfo.tiempo} alt="Profile" style={{ width: '100%', marginBottom: '16px' }} />
          <Text strong>Temperatura:</Text> <Text>{userInfo.temperature}</Text><Text strong> Grados</Text><br />
          <Text strong>Viento:</Text> <Text>{userInfo.wind}</Text><Text strong> Km/h</Text><br />
        </Col>
      </Row>
    </Card>
  );
};

export default UserProfile;
