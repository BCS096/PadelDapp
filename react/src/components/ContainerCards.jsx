import React from 'react';
import { useState, useEffect } from 'react'
import { Row, Col, Card } from 'antd';
import './ContainerCards.css';
import { PadelDBService } from '../services/PadelDBService';

function ContainerCards() {

  const padelDBService = new PadelDBService();
  const [listaClubs, setListaClubs] = useState([]);
  
  useEffect(() => {
    padelDBService.getClubs().then((response) => {
      setListaClubs(response);
      console.log('Clubs:', response);
    });
    console.log(listaClubs);

  }, []);

  return (
    <Row gutter={[100, 100]} className="CardContainer">
      {listaClubs.map((club, index) => (
      <Col key={index}>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt={club.nom} src={club.foto} width={600} height={250}/>}
        >
          <Card.Meta title={club.nom} description={club.direccio} />
          <p>Telefono: {club.telefono}</p>
          <p>Email: {club.email}</p>
        </Card>
      </Col>
    ))}
    </Row>
  );
}

export default ContainerCards;
