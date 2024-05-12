import React from 'react';
import { Button, Form, Input, Select, Space } from 'antd';
import { PadelDBService } from '../services/PadelDBService';
import { useWeb3 } from '../Web3Provider';
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

const JugadorForm = () => {

    const [form] = Form.useForm();

    const { account } = useWeb3();

    const padelDBService = new PadelDBService();

    const onFinish = (values) => {
        values.address = account;
        padelDBService.añadirUsuario(values).then(() => {
            console.log("Usuario añadido");
            //redireccionar
        });

    };

    const onReset = () => {
        form.resetFields();
    };

    
    return (
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
    );
};
export default JugadorForm;