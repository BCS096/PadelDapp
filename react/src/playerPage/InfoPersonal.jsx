import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, Divider, Modal, Alert, Select } from 'antd';
import { useWeb3 } from '../Web3Provider';
import { PadelDBService } from '../services/PadelDBService';
import './InfoPersonal.css';


const { Option } = Select;

function MainPlayerPage({setName}) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({
        visible: false,
        message: '',
        description: '',
        type: ''
    });
    const { account } = useWeb3();
    const padelDBService = new PadelDBService();

    useEffect(() => {
        if (account) {
            padelDBService.getUsuario(account).then((res) => {
                form.setFieldsValue({
                    nombre: res.nombre,
                    telefono: res.telefono,
                    email: res.email,
                    edad: res.edad,
                    genero: res.genero
                });
            });
        }
    }, [account, form]);

    const handleCancel = () => {
        setModal({ visible: false });
    };

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            values.name = values.nombre;
            await padelDBService.updateUsuario(account, values);
            setModal({
                visible: true,
                message: 'Datos actualizados',
                description: 'Los datos del club han sido actualizados correctamente',
                type: 'success'
            });
            setName(values.nombre);
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

    return (
        <>
            <div className='personal-player-div'>
                <div className="titulo" style={{ margin: '8%' }}>
                    <h1 className="title">Tus datos personales</h1>
                </div>
                <Divider type="vertical" className="vertical-divider-cuadro" />
                <div className='personal-player-box-div'>
                    <Form form={form} onFinish={handleFinish} layout="vertical" className="large-form">
                        <Form.Item
                            label={<span className="form-label">Nombre</span>}
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
                            label={<span className="form-label">Edad</span>}
                            name="edad"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label={<span className="form-label">Género</span>}
                            name="genero"
                            rules={[{ required: true }]}
                        >
                            <Select placeholder="Seleccione un género" allowClear>
                                <Option value="masculino">Masculino</Option>
                                <Option value="femenino">Femenino</Option>
                                <Option value="otro">Otro</Option>
                            </Select>
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
}

export default MainPlayerPage;