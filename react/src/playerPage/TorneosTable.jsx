import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, DatePicker } from 'antd';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import { useWeb3 } from '../Web3Provider';
import { PadelDBService } from '../services/PadelDBService';
import { Modal } from 'antd';
import { Form } from 'antd';
import { Select } from 'antd';
import PadelTokenJSON from '../assets/contracts/PadelToken.json'
import { PadelTokenService } from '../services/PadelTokenService';
import { Alert } from 'antd';

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


const App = ({ torneos, setTorneos }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const { web3, account } = useWeb3();
  const padelDBService = new PadelDBService();
  const [apuntarModalVisible, setApuntarModalVisible] = useState(false);
  const [torneoSelected, setTorneoSelected] = useState(null);
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [modal, setModal] = useState({
    visible: false,
    message: '',
    description: '',
    type: ''
  });

  useEffect(() => {
    if (apuntarModalVisible) {
      padelDBService.getJugadores().then((jugadores) => {
        setOptions(jugadores);
        console.log('jugadores', jugadores);
      });
    }
  }, [apuntarModalVisible]);

  const onFinish = async (values) => {
    const compañero = values.jugador;
    const torneoAddress = torneoSelected.address;
    const pdtContract = new web3.eth.Contract(PadelTokenJSON.abi, PDT_CONTRACT);
    const pdtService = new PadelTokenService(pdtContract);
    pdtService.pagarInscripcion(account, compañero, torneoAddress).then(() => {
      const rq = {
        jugador1: account,
        jugador2: compañero,
        torneo: torneoAddress,
      };
      console.log('Inscripcion pagada');
      padelDBService.añadirParticipacion(rq).then(() => {
        console.log('Torneo apuntado');
        setApuntarModalVisible(false);
        setModal({
          visible: true,
          message: `Te has apuntado correctamente`,
          type: 'success'
        });
        padelDBService.getTorneosActivos(account).then((torneos) => {
          setTorneos(torneos);
        });
        form.resetFields();
      });
    }).catch((error) => {
      console.error('An error occurred:', error);
      setModal({
        visible: true,
        message: `Error al apuntarse al torneo`,
        description: "Puede ser debido a que no tienes suficientes tokens o tu compañero ya está apuntado",
        type: 'error'
      });
    });
  };
  const onReset = () => {
    form.resetFields();
  };

  const handleCancel = () => {
    setModal({ visible: false });
  };

  const handleButtonClick = async (torneo) => {
    openApuntarModal(true)
    setTorneoSelected(torneo);
  };

  const closeApuntarModal = () => {
    setApuntarModalVisible(false);
  };

  const openApuntarModal = () => {
    setApuntarModalVisible(true);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex, isDate = false) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        {isDate ? (
          <DatePicker
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0] ? moment(selectedKeys[0], 'DD/MM/YYYY') : null}
            format="DD/MM/YYYY"
            onChange={(date, dateString) => setSelectedKeys(dateString ? [dateString] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
        ) : (
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
        )}
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#fff' : undefined }} />
    ),
    onFilter: (value, record) => {
      if (isDate) {
        return moment(record[dataIndex], 'DD/MM/YYYY').isSame(moment(value, 'DD/MM/YYYY'));
      }
      return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const dateSorter = (a, b, key) => {
    const dateA = new Date(a[key].split('/').reverse().join('-'));
    const dateB = new Date(b[key].split('/').reverse().join('-'));
    return dateA - dateB;
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'key',
      ...getColumnSearchProps('nombre'),
      align: 'center',
    },
    {
      title: 'Nombre del Club',
      dataIndex: 'clubName',
      key: 'key',
      ...getColumnSearchProps('clubName'),
      align: 'center',
    },
    {
      title: 'Dirección del Club',
      dataIndex: 'clubAddress',
      key: 'key',
      ...getColumnSearchProps('clubAddress'),
      align: 'center',
    },
    {
      title: 'Telefono de contacto',
      dataIndex: 'clubTelefono',
      key: 'key',
      ...getColumnSearchProps('clubTelefono'),
      align: 'center',
    },
    {
      title: 'Fecha Inicio',
      dataIndex: 'fechaInicio',
      key: 'key',
      ...getColumnSearchProps('fechaInicio', true),
      sorter: (a, b) => dateSorter(a, b, 'fechaInicio'),
      sortDirections: ['descend', 'ascend'],
      align: 'center',
    },
    {
      title: 'Fecha Final',
      dataIndex: 'fechaFinal',
      key: 'fechaFinal',
      ...getColumnSearchProps('fechaFinal', true),
      sorter: (a, b) => dateSorter(a, b, 'fechaFinal'),
      sortDirections: ['descend', 'ascend'],
      align: 'center',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space size="middle">
          <Button className="button-actions" onClick={() => handleButtonClick(record)} type="primary">
            Apuntarse
          </Button>
        </Space>
      ),
      align: 'center',
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={torneos} pagination={{ position: ['bottomCenter'], pageSize: 5 }} className="custom-table" />
      {
        apuntarModalVisible == true && web3 && (
          <Modal visible={true} footer={null} maskClosable={true} onCancel={closeApuntarModal}>
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
                name="jugador"
                label="Jugador"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  placeholder="Select tu compañero de juego"
                  allowClear
                >
                  {options.map(option => (
                    <Option key={option.address} value={option.address}>
                      {option.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.jugador !== currentValues.jugador}
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
            </Form>
          </Modal>
        )
      }
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
    </>
  );
};

export default App;
