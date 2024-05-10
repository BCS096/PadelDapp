import React from 'react';
import { Row, Col, Card } from 'antd';
import './Prueba.css';

function Prueba({ numColumns }) {
  // Calculamos el ancho de la columna para cada tamaño de pantalla
  const spanSize = 24 / numColumns;

  return (
    <Row gutter={[100, 100]} className="CardContainer">
      {[...Array(numColumns)].map((_, index) => (
        <Col key={index}>
          <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" width={600} height={250}/>}
          >
            <Card.Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Prueba;
