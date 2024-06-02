import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, DatePicker, Tag, Checkbox } from 'antd';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import './MisTorneosTable.css';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../Web3Provider';
import TorneoJSON from '../assets/contracts/Torneo.json';
import { TorneoService } from '../services/TorneoService';
import { PadelDBService } from '../services/PadelDBService';

const App = ({ torneos, setTorneos }) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const { web3, account } = useWeb3();
  const [torneoService, setTorneoService] = useState(null);
  const [iniciar, setIniciar] = useState("");
  const padelDBService = new PadelDBService();

  useEffect(() => {
    if (torneoService && iniciar != "") {
      torneoService.cerrarInscripciones(account).then(() => {
        setIniciar(false);
        setTorneoService(null);
        padelDBService.updateTorneoStatus(iniciar, {status: 'PLAYING'}).then(() => {
          padelDBService.getTorneosByOwner(account).then((torneos) => {
            torneos.forEach((torneo) => {
              torneo.key = torneo.address;
            });
            setTorneos(torneos);
          });
        });
      });
    }
  }, [torneoService, iniciar, account]);
 
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

  const handleButtonClick = async (action, record) => {
    if (action === 'initTorneo' && web3) {
      const torneoContract = new web3.eth.Contract(TorneoJSON.abi, record.address);
      setTorneoService(new TorneoService(torneoContract));
      setIniciar(record.address);
    } else {
      localStorage.setItem('nombreTorneo', record.nombre);
      localStorage.setItem('addressTorneo', record.address);
      navigate(`/club/torneos/${action}`);
    }
  };

  const dateSorter = (a, b, key) => {
    const dateA = new Date(a[key].split('/').reverse().join('-'));
    const dateB = new Date(b[key].split('/').reverse().join('-'));
    return dateA - dateB;
  };

  const getTraduction = (key) => {
    switch (key) {
      case 'OPENED':
        return 'Inscripciones abiertas';
      case 'PLAYING':
        return 'En juego';
      case 'CANCELED':
        return 'Cancelado';
      case 'FINISHED':
        return 'Finalizado';
      default:
        return key;
    }
  };

  const statusFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
    <div style={{ padding: 8 }}>
      <Checkbox.Group
        options={[
          { label: 'Inscripciones abiertas', value: 'OPENED' },
          { label: 'En juego', value: 'PLAYING' },
          { label: 'Cancelado', value: 'CANCELED' },
          { label: 'Finalizado', value: 'FINISHED' },
        ]}
        value={selectedKeys}
        onChange={(checkedValues) => setSelectedKeys(checkedValues)}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, 'status')}
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
            setSearchedColumn('status');
          }}
        >
          Filter
        </Button>
        <Button type="link" size="small" onClick={() => close()}>
          close
        </Button>
      </Space>
    </div>
  );

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      width: '30%',
      ...getColumnSearchProps('nombre'),
      align: 'center',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: '40%',
      ...getColumnSearchProps('address'),
      align: 'center',
    },
    {
      title: 'Estado',
      key: 'status',
      dataIndex: 'status',
      filterDropdown: statusFilterDropdown,
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      render: (status) => {
        let color;
        switch (status) {
          case 'OPENED':
            color = 'geekblue';
            break;
          case 'PLAYING':
            color = 'green';
            break;
          case 'CANCELED':
            color = 'volcano';
            break;
          case 'FINISHED':
            color = 'gold';
            break;
          default:
            color = 'gray';
        }
        return <Tag color={color}>{getTraduction(status.toUpperCase())}</Tag>;
      },
      align: 'center',
    },
    {
      title: 'Fecha Inicio',
      dataIndex: 'fechaInicio',
      key: 'fechaInicio',
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
        {(record.status !== 'CANCELED' && record.status !== 'OPENED') && (
          <>
            <Button className="button-actions" onClick={() => handleButtonClick('partidos', record)} type="primary">
              Partidos
            </Button>
            <Button className="button-actions" onClick={() => handleButtonClick('cuadro', record)} type="primary">
              Cuadro
            </Button>
          </>
        )}
        {(record.status === 'OPENED') && (
          <Button className="button-actions" onClick={() => handleButtonClick('initTorneo', record)} type="primary">
            Iniciar torneo
          </Button>
        )}
        <Button className="button-actions" onClick={() => handleButtonClick('jugadores', record)} type="primary">
          Jugadores
        </Button>
      </Space>
      ),
      align: 'center',
    },
  ];

  return (
    <>
    <Table columns={columns} dataSource={torneos} pagination={{ position: ['bottomCenter'], pageSize: 5  }} className="custom-table" />
    </>
  );
};

export default App;
