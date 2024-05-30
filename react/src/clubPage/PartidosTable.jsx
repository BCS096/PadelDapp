import React, { useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space } from 'antd';
import { useState } from 'react';
import { useWeb3 } from '../Web3Provider';
import { TorneoService } from '../services/TorneoService';
import TorneoJSON from '../assets/contracts/Torneo.json';
import { PadelDBService } from '../services/PadelDBService';
import { DatePicker } from 'antd';
import { MailService } from '../services/MailService';
import './PartidosTable.css';

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
  const [nuevoHorario, setNuevoHorario] = useState(false);
  const [partida, setPartida] = useState({});
  const [form] = Form.useForm();
  const [formHorario] = Form.useForm();
  const { web3, account } = useWeb3();
  const [torneoService, setTorneoService] = useState(null);
  const [añadirResultado, setAñadirResultado] = useState(false);
  const [añadirHorario, setAñadirHorario] = useState(false);
  const [resultado, setResultado] = useState({});
  const [horario, setHorario] = useState({});
  const padelDBService = new PadelDBService();
  const mailService = new MailService();

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
        padelDBService.updateTorneoStatus(localStorage.getItem('addressTorneo'), { status: 'FINISHED' });
      }
    }
  }, [torneoService, añadirResultado, resultado]);

  useEffect(() => {
    if (torneoService && añadirHorario && horario) {
      torneoService.setHorario(horario.idPartida, horario.horario, account).then(() => {
        setAñadirHorario(false);
        setNuevoHorario(false);
        setHorario({});
        datos[buscarPartida(horario.idPartida)].horario = horario.horario;
        padelDBService.getEmailJugadores(partida).then((emails) => {
          emails.forEach((email) => {
            mailService.sendMail(email.email, email.nombre, horario.horario);
          });
        });
      });
    }
  }, [torneoService, añadirHorario, horario]);

  const buscarPartida = (idPartida) => {
    return datos.findIndex((partida) => partida.idPartida === idPartida);
  };

  const closeResultadoModal = () => {
    setNuevoResultado(false);
  };

  const closeHorarioModal = () => {
    setNuevoHorario(false);
  };

  const newHorario = (record) => {
    setPartida(record);
    form.setFieldsValue({ idPartida: record.idPartida });
    setNuevoHorario(true);
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

  const onFinishHorario = (values) => {
    const formattedDateTime = values.dateTime.format('DD/MM/YYYY HH:mm');
    const torneoContract = new web3.eth.Contract(TorneoJSON.abi, localStorage.getItem('addressTorneo'));
    setTorneoService(new TorneoService(torneoContract));
    let rq = {
      idPartida: values.idPartida,
      horario: formattedDateTime,
    };
    setHorario(rq);
    setAñadirHorario(true);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onResetHorario = () => {
    formHorario.resetFields();
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
          {record.horario == "" && record.ganador == 0 && record.equipo1.jugador2 !== "" && record.equipo2.jugador2 !== ""? (
            <Button type="primary" onClick={() => newHorario(record)}>Añadir horario</Button>
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
    <>
      <Table columns={columns} dataSource={datos} className='partidos-table' />
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

      {nuevoHorario && (
        <Modal open={true} footer={null} maskClosable={true} onCancel={closeHorarioModal}>
          <div>
            <Form
              {...layout}
              form={formHorario}
              name="resultado"
              onFinish={onFinishHorario}
              style={{
                maxWidth: 600,
              }}
            >
              <Form.Item
                name="dateTime"
                label="Fecha y hora"
                rules={[{ required: true, message: 'Selecciona el horario' }]}
              >
                <DatePicker showTime format="DD-MM-YYYY HH:mm:ss" />
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
                  <Button htmlType="button" onClick={onResetHorario}>
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
