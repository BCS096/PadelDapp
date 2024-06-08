import React from 'react';
import { Button, Form, Input, Select, Space } from 'antd';
import { PadelDBService } from '../services/PadelDBService';
import { useWeb3 } from '../Web3Provider';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PadelTokenJSON from '../assets/contracts/PadelToken.json'
import { PadelTokenService } from '../services/PadelTokenService';
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

const PDT_CONTRACT = PadelTokenJSON.address;

const JugadorForm = () => {

    const [form] = Form.useForm();

    const { account, web3 } = useWeb3();

    const [recompensaModal, setRecompensaModal] = useState(false);

    const padelDBService = new PadelDBService();

    const navigate = useNavigate();

    const onFinish = async (values) => {
        setRecompensaModal(true);
        try {
            values.address = account;
            await padelDBService.añadirUsuario(values);
            const pdtContract = new web3.eth.Contract(PadelTokenJSON.abi, PDT_CONTRACT);
            const pdtService = new PadelTokenService(pdtContract);
            await pdtService.recompensaRegistro(account);

        } catch (error) {
            console.log(error);
        } finally {
            setRecompensaModal(false);
            navigate('/jugador');
        }

    };

    const onReset = () => {
        form.resetFields();
    };


    return (
        <>
            {
                recompensaModal == false && (
                    <Form
                        {...layout}
                        form={form}
                        name="control-hooks"
                        onFinish={onFinish}
                        style={{
                            maxWidth: 600,
                        }}
                    >
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="edad"
                            label="Edad"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="telefono"
                            label="Teléfono"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="genero"
                            label="Género"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                placeholder="Seleccione un género"
                                allowClear
                            >
                                <Option value="masculino">Masculino</Option>
                                <Option value="femenino">Femenino</Option>
                                <Option value="otro">Otro</Option>
                            </Select>
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
                    </Form>
                )
            }
            {
                recompensaModal == true && web3 && (
                    <p>
                        Acepta la recompensa de x PDTs para apuntarte a tus primeros torneos. Si no lo acepta ahora, no podrá obtenerlos más tarde.
                    </p>
                )
            }

        </>
    );
};
export default JugadorForm;