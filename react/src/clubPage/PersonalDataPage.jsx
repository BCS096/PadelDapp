import React from 'react';
import './PersonalDataPage.css';
import { Form, Input, DatePicker, Button, Modal, Alert, Divider, Spin } from 'antd';
import { useState } from 'react';
import { Col } from 'antd';
import { Row } from 'antd';
import { PadelDBService } from '../services/PadelDBService';
import { Image } from 'antd';


const PersonalDataPage = ({ pdt, club, imagen, setFoto, setClubName }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const padelDBService = new PadelDBService();
  const [modal, setModal] = useState({
    visible: false,
    message: '',
    description: '',
    type: ''
  });

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
      <Row className="right-pane">
        <div className='image-div'>
          <Image
            width={300}
            height={200}
            src={imagen}
          />
          <div className="custom-file-input-info image-button" onChange={handleFileInputChange}>
            <input type="file" className="file-input-info" />
            <label htmlFor="file-input-info" className="file-label-info">
              {'Seleccionar archivo'}
            </label>
          </div>
        </div>
        
      </Row>
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