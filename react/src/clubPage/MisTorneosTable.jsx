import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, DatePicker, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import './MisTorneosTable.css';



const App = ( {data} ) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

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
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {isDate ? (
          <DatePicker
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0] ? moment(selectedKeys[0], 'DD/MM/YYYY') : null}
            format="DD/MM/YYYY"
            onChange={(date, dateString) => setSelectedKeys(dateString ? [dateString] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
        ) : (
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: 'block',
            }}
          />
        )}
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#fff' : undefined,
        }}
      />
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
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleButtonClick = (action, record) => {
    console.log(`${action} clicked for record:`, record);
    // You can add more logic here based on the action and record
  };

  const dateSorter = (a, b, key) => {
    const dateA = new Date(a[key].split('/').reverse().join('-'));
    const dateB = new Date(b[key].split('/').reverse().join('-'));
    return dateA - dateB;
  };

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
          <Button className='button-actions' onClick={() => handleButtonClick('Edit', record)} type="primary">Partidos</Button>
          <Button className='button-actions' onClick={() => handleButtonClick('Delete', record)} type="primary">Cuadro</Button>
          <Button className='button-actions' onClick={() => handleButtonClick('View', record)} type="primary">Equipos</Button>
        </Space>
      ),
      align: 'center',
    },
  ];

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
  }

  return (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ position: ['bottomCenter'] }}
          className="custom-table"
        />
  );
};

export default App;
