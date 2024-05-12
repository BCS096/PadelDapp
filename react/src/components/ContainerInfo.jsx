import React from 'react';
import { Row, Col } from 'antd';
import pelota from './pelota.webp';
import pala from './pala.png';
import './ContainerInfo.css';

function ContainerInfo() {
    return (
        <div>
            <Row gutter={[16, 16]} style={{ flex: 1, marginBottom: '2%' }}>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ marginRight: 25}}>
                                <img src={pelota} width={75} height={75} />
                            </div>
                            <Col className= 'title-info info-description' style={{ textAlign: 'center' }}>
                                <h1>Haz deporte con nosotros!</h1>
                                <p>
                                    Haz ejercicio y una vida sana jugando <br /> nuestro deporte favorito.
                                </p>
                            </Col>
                        </div>
                    </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: 25 }}>
                            <img src={pala} width={75} height={75} />
                        </div>
                        <Col className= 'title-info info-description' style={{ textAlign: 'center' }}>
                            <h1>Disfruta del mejor Pádel</h1>
                            <p>
                                Disfruta de jugar al pádel compitiendo <br /> con tus amigos en los mejores torneos en tu club favorito.
                            </p>
                        </Col> 
                    </div>
                </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: 25 }}>
                            <img src={pelota} width={75} height={75} />
                        </div>
                        <Col className= 'title-info  info-description' style={{ textAlign: 'center' }}>
                            <h1>Gana recompensas</h1>
                            <p>
                                Mientras juegas, gana Padel Tokens <br /> y vuelve a puntarte a otro torneo.
                            </p>
                        </Col>
                    </div>
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: 25 }}>
                            <img src={pala} width={75} height={75} />
                        </div>
                        <Col className= 'title-info info-description' style={{ textAlign: 'center' }}>
                            <h1>Aprovecha la nueva era de la tecnología</h1>
                            <p>
                                Cansado de que no sepas como se genera el cuadro y dudas de la organización de los torneos? <br />
                                Con Padel Dapp podrás ver en tiempo real como se genera el cuadro y la organización de los torneos <br />
                                gracias a la tecnología blockchain y los contratos inteligentes.
                            </p>
                        </Col>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default ContainerInfo;