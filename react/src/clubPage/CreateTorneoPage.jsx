import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Button, Modal, Alert, Divider, Spin } from 'antd';
import './CreateTorneoPage.css';
import { useWeb3 } from '../Web3Provider';
import { CreateTorneoService } from '../services/CreateTorneoService';
import { PadelDBService } from '../services/PadelDBService';

const { RangePicker } = DatePicker;

const padelDBService = new PadelDBService();

function formatDateWithoutMoment(M2) {
  let day = M2.date();
  let month = M2.month() + 1;
  let year = M2.year();

  let formattedDay = day < 10 ? '0' + day : day;
  let formattedMonth = month < 10 ? '0' + month : month;

  let formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

  return formattedDate;
}

const FormWithModal = () => {
  const { web3, account } = useWeb3();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    visible: false,
    message: '',
    description: '',
    type: ''
  });
  const [createTorneoService, setCreateTorneoService] = useState(null);

  useEffect(() => {
    if (web3 && account) {
      setCreateTorneoService(new CreateTorneoService(web3));
    }
  }, [web3, account]);

  const handleFinish = async (values) => {
    let { name, dates } = values;
    let startDate = formatDateWithoutMoment(dates[0]);
    let endDate = formatDateWithoutMoment(dates[1]);
    setLoading(true);

    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 120000); //2 minutos
    });

    try {
      if (createTorneoService) {
        const response = await Promise.race([
          createTorneoService.createTorneo(name, startDate, endDate, account, { signal }),
          timeoutPromise
        ]);
        
        let torneo = {
          nombre: name,
          fechaInicio: startDate,
          fechaFinal: endDate,
          address: response,
          owner: account
        };

        await padelDBService.añadirTorneo(torneo);

        setModal({
          visible: true,
          message: `Torneo ${name} creado con éxito`,
          description: 'El torneo ha sido creado correctamente.',
          type: 'success'
        });
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
      if (error.message === 'Timeout') {
        setModal({
          visible: true,
          message: 'Tiempo de espera agotado',
          description: 'La solicitud ha tardado demasiado y ha sido cancelada. Inténtalo de nuevo.',
          type: 'error'
        });
      } else {
        setModal({
          visible: true,
          message: 'Error al intentar crear el torneo',
          description: 'Póngase en contacto con el administrador del sistema para obtener ayuda.',
          type: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setModal({ visible: false });
  };

  return (
    <>
      <div className="header-container">
        <h1 className="title">Crear Torneo</h1>
      </div>
      <Divider type="vertical" className="vertical-divider" />
      <div className="form-container">
        <Form form={form} onFinish={handleFinish} layout="vertical" className="large-form">
          <Form.Item
            label={<span className="form-label">Nombre del torneo</span>}
            name="name"
            rules={[{ required: true, message: 'Por favor, ingrese su nombre' }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label={<span className="form-label">Fechas de inicio y final</span>}
            name="dates"
            rules={[{ required: true, message: 'Por favor, seleccione las fechas' }]}
          >
            <RangePicker size="large" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={loading}
              size="large"
              style={{ width: '100%', backgroundColor: 'rgb(0, 33, 64)', borderColor: '#1e90ff' }}
            >
              {loading ? <Spin /> : 'Crear Torneo'}
            </Button>
          </Form.Item>
        </Form>
        <Modal
          visible={modal.visible}
          onOk={handleCancel}
          onCancel={handleCancel}
          okText="Cerrar"
          okButtonProps={{ style: { display: 'none' } }}
          cancelButtonProps={{ style: { display: 'none' } }}
          style={{ position: 'absolute' }}
          className={`ant-modal-${modal.type} ant-modal-notification`}
        >
          <Alert
            message={modal.message}
            description={modal.description}
            type={modal.type}
            showIcon
          />
        </Modal>
      </div>
    </>
  );
};

export default FormWithModal;
