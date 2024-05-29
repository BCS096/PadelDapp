import React, { useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space } from 'antd';
import { useState } from 'react';
import { useWeb3 } from '../Web3Provider';
import { TorneoService } from '../services/TorneoService';
import TorneoJSON from '../assets/contracts/Torneo.json';
import { PadelDBService } from '../services/PadelDBService';

const getColorEquipo1 = (ganador) => {
  return ganador == 1 ? 'green' : ganador == 2 ? 'red' : 'black';
};

const getColorEquipo2 = (ganador) => {
  return ganador == 1 ? 'red' : ganador == 2 ? 'green' : 'black';
};

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const App = ({ datos }) => {
  const [nuevoResultado, setNuevoResultado] = useState(false);
  const [partida, setPartida] = useState({});
  const [form] = Form.useForm();
  const { web3, account } = useWeb3();
  const [torneoService, setTorneoService] = useState(null);
  const [añadirResultado, setAñadirResultado] = useState(false);
  const [resultado, setResultado] = useState({});
  const padelDBService = new PadelDBService();

  useEffect(() => {
    if (torneoService && añadirResultado && resultado) {
      torneoService.setResultado(resultado.idPartida, resultado.ganador, resultado.resultado, account).then(() => {
        setAñadirResultado(false);
        setNuevoResultado(false);
        setResultado({});
        datos[buscarPartida(resultado.idPartida)].resultado = resultado.resultado;
        datos[buscarPartida(resultado.idPartida)].ganador = resultado.ganador;
      });
      if (datos[0].ronda == "Final") {
        padelDBService.updateTorneoStatus(localStorage.getItem('addressTorneo'), {status: 'FINISHED'});
      }
    }
  }, [torneoService, añadirResultado, resultado]);

  const buscarPartida = (idPartida) => {
    return datos.findIndex((partida) => partida.idPartida === idPartida);
  };

  const closeResultadoModal = () => {
    setNuevoResultado(false);
  };

  const newResultado = (record) => {
    setPartida(record);
    form.setFieldsValue({ idPartida: record.idPartida });
    setNuevoResultado(true);
  };

  const onFinish = (values) => {
    if (web3) {
      const torneoContract = new web3.eth.Contract(TorneoJSON.abi, localStorage.getItem('addressTorneo'));
      setTorneoService(new TorneoService(torneoContract));
      setAñadirResultado(true);
      setResultado(values);
    }
    
  };

  const onReset = () => {
    form.resetFields();
  };

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
          {record.horario === "" && record.ganador === 0 ? (
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
          {record.resultado === "" && record.equipo1.jugador2 !== "" && record.equipo2.jugador2 !== "" ? (
            <Button type="primary" onClick={() => newResultado(record)}>Añadir resultado</Button>
          ) : (
            <div>{record.resultado}</div>
          )}
        </div>
      ),
    },
  ];

  return (
    console.log(datos),
    <>
      <Table columns={columns} dataSource={datos} />
      {nuevoResultado && (
        <Modal open={true} footer={null} maskClosable={true} onCancel={closeResultadoModal}>
          <div>
            <Form
              {...layout}
              form={form}
              name="resultado"
              onFinish={onFinish}
              style={{
                maxWidth: 600,
              }}
            >
              <Form.Item
                name="resultado"
                label="Resultado"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="ganador"
                label="Ganador"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  placeholder="Selecciona el ganador de la partida"
                  allowClear
                >
                  <Option value={1}>{partida.equipo1.jugador1} / {partida.equipo1.jugador2}</Option>
                  <Option value={2}>{partida.equipo2.jugador1} / {partida.equipo2.jugador2}</Option>
                </Select>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.ganador !== currentValues.ganador}
              >
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <Button htmlType="button" onClick={onReset}>
                    Reset
                  </Button>
                </Space>
              </Form.Item>
              <Form.Item
                name="idPartida"
                initialValue={partida.idPartida}
                hidden
              >
                <Input />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default App;
