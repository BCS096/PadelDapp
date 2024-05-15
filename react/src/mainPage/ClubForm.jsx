import React, { useState } from 'react';
import { Button, Form, Input, Select, Space } from 'antd';
import { useWeb3 } from '../Web3Provider';
import { PadelDBService } from '../services/PadelDBService';

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

const ClubForm = () => {
    const [form] = Form.useForm();
    const { account } = useWeb3();
    const padelDBService = new PadelDBService();
    const [selectedFile, setSelectedFile] = useState(null);

    const onFinish = (values) => {
        values.address = account;
        values.imagen = selectedFile;
        padelDBService.añadirClub(values).then(() => {
            //redireccion
        });
    };

    const onReset = () => {
        form.resetFields();
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        // Aquí puedes hacer lo que necesites con el archivo seleccionado
        setSelectedFile(file);
        
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
                name="direccion"
                label="Dirección"
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
                label="Imagen"
                name="imagen"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <input type="file" onChange={handleFileInputChange} />
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

export default ClubForm;
