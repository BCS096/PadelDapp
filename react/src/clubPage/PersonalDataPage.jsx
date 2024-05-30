import React, { useEffect } from 'react';
import './PersonalDataPage.css';
import { Form, Input, DatePicker, Button, Modal, Alert, Divider, Spin } from 'antd';
import { useState } from 'react';
import { Col } from 'antd';
import { Row } from 'antd';
import { PadelDBService } from '../services/PadelDBService';
import { Image } from 'antd';
import { InputNumber } from 'antd';
import { useWeb3 } from '../Web3Provider';
import { PadelTokenService } from '../services/PadelTokenService';
import PadelTokenJSON from '../assets/contracts/PadelToken.json';

const PDT_CONTRACT = "0x9cCE28475A3417882D95dba489Dd8C58F0E86d47";

const PersonalDataPage = ({ pdt, club, imagen, setFoto, setClubName }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(0);
  const [loadingVenta, setLoadingVenta] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const padelDBService = new PadelDBService();
  const { account, web3 } = useWeb3();
  const [modal, setModal] = useState({
    visible: false,
    message: '',
    description: '',
    type: ''
  });
  const [pdtVenta, setPdtVenta] = useState(0);
  const [padelTokenService, setPadelTokenService] = useState(null);

  useEffect(() => {
    if(web3){
      const pdtContract = new web3.eth.Contract(PadelTokenJSON.abi, PDT_CONTRACT);
      setPadelTokenService(new PadelTokenService(pdtContract));
    }
  }, [web3]);

  useEffect(() => {
    if (padelTokenService != null) {
      padelTokenService.getAllowSell(account).then((response) => {
        setPdtVenta(response);
      });
    }
  }, [padelTokenService]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await padelDBService.updateClub(club.address, values);
      setModal({
        visible: true,
        message: 'Datos actualizados',
        description: 'Los datos del club han sido actualizados correctamente',
        type: 'success'
      });
      setClubName(values.nombre);
    } catch (error) {
      setModal({
        visible: true,
        message: 'Error al actualizar los datos',
        description: 'Ha ocurrido un error al actualizar los datos del club',
        type: 'error'
      });
    }
    setLoading(false);
  };

  const handlePDTVenta = async () => {
    setLoadingVenta(true);
    try {
      await padelTokenService.setAllowSell(account, inputValue);
      await padelTokenService.getAllowSell(account).then((response) => {
        setPdtVenta(response);
      });
      setModal({
        visible: true,
        message: 'Tokens en venta actualizados',
        description: 'Los tokens en venta han sido actualizados correctamente',
        type: 'success'
      });
    } catch (error) {
      setModal({
        visible: true,
        message: 'Error al actualizar los tokens en venta',
        description: 'Ha ocurrido un error al actualizar los tokens en venta',
        type: 'error'
      });
    }
    setLoadingVenta(false);
  };

  const handleCancel = () => {
    setModal({ visible: false });
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    console.log('file', file);
    padelDBService.actualizarImagenClub(club.address, file).then((response) => {
      setFoto(response);
    });
  };

  return (
    <Col className="split-screen">
      <Row className="left-pane">
        <div>
          <h2 className='blue-color'>
            Nº de Padel Tokens: {pdt} PDT
          </h2>
        </div>
        <div className="form-container">
          <Form form={form} onFinish={handleFinish} layout="vertical" className="large-form"
            initialValues={{
              nombre: club.nom,
              telefono: club.telefono,
              email: club.email,
              direccion: club.direccio
            }}
          >
            <Form.Item
              label={<span className="form-label">Nombre del club</span>}
              name="nombre"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={<span className="form-label">Teléfono</span>}
              name="telefono"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={<span className="form-label">Email</span>}
              name="email"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={<span className="form-label">Dirección</span>}
              name="direccion"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                disabled={loading}
                size="large"
                style={{ width: '100%', backgroundColor: 'rgb(0, 33, 64)', borderColor: '#1e90ff' }}
              >
                {loading ? <Spin /> : 'Actualizar datos'}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Row>
      <div className="right-pane">
        <div className='personal-div'>
          <Image
            width={463}
            height={300}
            src={imagen}
          />
          <div className="custom-file-input-info image-button" onChange={handleFileInputChange}>
            <input type="file" className="file-input-info" />
            <label htmlFor="file-input-info" className="file-label-info">
              {'Seleccionar archivo'}
            </label>
          </div>
        </div>
        <div className="personal-div">
          <h2 className='blue-color'>
            Nº de PDT en venta: {pdtVenta}
          </h2>
          <div style={{display: 'flex'}}>
            <InputNumber
              min={0}
              defaultValue={0}
              value={inputValue}
              onChange={setInputValue}
              style={{ width: '300px', height: '40px', fontSize: '36px', textAlign: 'center', justifyContent: 'center', margin: '0 30px'}}
              className="square-input-number"
            />
            <Button
              type="primary"
              onClick={handlePDTVenta}
              disabled={loadingVenta}
              size="large"
              style={{ width: '100%', backgroundColor: 'rgb(0, 33, 64)', borderColor: '#1e90ff' }}
            >
              {loadingVenta ? <Spin /> : 'Establecer'}
            </Button>
          </div>
        </div>
      </div>
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
    </Col>
  );
};

export default PersonalDataPage;