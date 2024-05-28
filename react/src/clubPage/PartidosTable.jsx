import React, { useEffect } from 'react';
import { Table, Button } from 'antd';

const columns = [
  {
    title: 'Nº de partido',
    dataIndex: 'idPartida',
    key: 'idPartida',
    render: (_, record) => (
      <div>
        <div>{record.idPartida}</div>
      </div>
    ),
  },
  {
    title: 'Equipo 1',
    key: 'equipo1',
    render: (_, record) => (
      <div style={{ color: getColorEquipo1(record.ganador) }}>
        <div>{record.equipo1.jugador1}</div>
        <div>{record.equipo1.jugador2}</div>
      </div>
    ),
  },
  {
    title: 'Equipo 2',
    key: 'equipo2',
    render: (_, record) => (
      <div style={{ color: getColorEquipo2(record.ganador) }}>
        <div>{record.equipo2.jugador1}</div>
        <div>{record.equipo2.jugador2}</div>
      </div>
    ),
  },
  {
    title: 'Horario',
    key: 'horario',
    render: (_, record) => (
      <div>
        {(record.horario === "" && record.ganador == 0) ? (
          <Button type="primary">Añadir horario</Button>
        ) : (
          <div>{record.horario}</div>
        )}
      </div>
    ),
  },
  {
    title: 'Resultado',
    key: 'resultado',
    render: (_, record) => (
      <div>
        {(record.resultado === "" && record.equipo1.jugador2 != "" && record.equipo2.jugador2 != "") ? (
          <Button type="primary">Añadir resultado</Button>
        ) : (
          <div>{record.resultado}</div>
        )}
      </div>
    ),
  },
];

const getColorEquipo1 = (ganador) => {
  if (ganador == 1) {
    return 'green';
  } else if (ganador == 2) {
    return 'red';
  }
  return 'black';
};

const getColorEquipo2 = (ganador) => {
  if (ganador == 1) {
    return 'red';
  } else if (ganador == 2) {
    return 'green';
  }
  return 'black';
};

const App = ({ datos }) => {
  useEffect(() => {
    console.log(datos);
  }, [datos]);

  return (
    <Table columns={columns} dataSource={datos} />
  );
};

export default App;
