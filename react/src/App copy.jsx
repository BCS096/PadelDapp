import { useState, useEffect } from 'react'
import './App.css'
import { useWeb3 } from './Web3Provider';
import { ContadorService } from './services/ContadorService';
import { TorneoService } from './services/TorneoService';
import { PadelDBService } from './services/PadelDBService';
import { Form, Input, DatePicker, Button } from 'antd';
import { CreateTorneoService } from './services/CreateTorneoService';
import moment from 'moment';

const { RangePicker } = DatePicker;

function App() {
  const [count, setCount] = useState(0);
  const {initializeWeb3, web3, account} = useWeb3();
  const [form] = Form.useForm();

  const [createTorneoService, setCreateTorneoService] = useState(null);

  useEffect(() => {
    if (web3) {
      setCreateTorneoService(new CreateTorneoService(web3));
    }
  }, [web3]);

  const onFinish = (values) => {
    console.log('Form values:', values);
    const fechasString = values.fechas.map(date => moment(date).format('DD/MM/YY'));
    console.log(web3);
    console.log(createTorneoService);
    if(web3 && createTorneoService) {
      createTorneoService.createTorneo(values.nombreTorneo, fechasString[0], fechasString[1], account).then((direccion) => {
        console.log('Torneo creado en la direccion: ' + direccion);
      }).catch(error => {
        console.error('Error al crear el torneo:', error);
      });
    }
  };

const getValue = () => {
  const contractAddress = "0x0D55553047792973ac0f9930F66475c11b8ddad4";
  const contractAbi = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "newValue",
          type: "uint256",
        },
      ],
      name: "CountIncreased",
      type: "event",
    },
    {
      inputs: [],
      name: "getCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "increment",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const contratoTorneoAddress = '0x0802eF52A1b003eb7068c358949C5BFcdf018DC3';

  const contratoTorneoABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenContract",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_nombreTorneo",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_fechaInicio",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_fechaFin",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "MAX_EQUIPOS",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "equipos",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "equipoId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "jugador1",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "jugador2",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "fechaFin",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "fechaInicio",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "nombreTorneo",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "numeroEquipos",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "partidas",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "proximaPartidaId",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "ronda",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "equipo1Id",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "equipo2Id",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "resultado",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "horario",
              "type": "bytes32"
            }
          ],
          "internalType": "struct Torneo.Partida",
          "name": "partida",
          "type": "tuple"
        },
        {
          "internalType": "bool",
          "name": "cuadroArriba",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "totalPartidas",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getFechaInicio",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getFechaFin",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getNombreTorneo",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "numPartida",
          "type": "uint256"
        }
      ],
      "name": "equiposByPartida",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getEquipos",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "equipoId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "jugador1",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "jugador2",
              "type": "address"
            }
          ],
          "internalType": "struct Torneo.Equipo[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "jugador1",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "jugador2",
          "type": "address"
        }
      ],
      "name": "addEquipo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "cerrarInscripciones",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPartidas",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "proximaPartidaId",
              "type": "uint256"
            },
            {
              "components": [
                {
                  "internalType": "bytes32",
                  "name": "ronda",
                  "type": "bytes32"
                },
                {
                  "internalType": "uint256",
                  "name": "equipo1Id",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "equipo2Id",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes32",
                  "name": "resultado",
                  "type": "bytes32"
                },
                {
                  "internalType": "bytes32",
                  "name": "horario",
                  "type": "bytes32"
                }
              ],
              "internalType": "struct Torneo.Partida",
              "name": "partida",
              "type": "tuple"
            },
            {
              "internalType": "bool",
              "name": "cuadroArriba",
              "type": "bool"
            }
          ],
          "internalType": "struct Torneo.NodoCuadro[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "numPartida",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "numEquipoPartidaGanador",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_resultado",
          "type": "string"
        }
      ],
      "name": "setResultado",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "numPartida",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_horario",
          "type": "string"
        }
      ],
      "name": "setHorario",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const contractTorneo = new web3.eth.Contract(contratoTorneoABI, contratoTorneoAddress);

  const contract = new web3.eth.Contract(contractAbi, contractAddress);
  const contadorService = new ContadorService(contract);
  const torneoService = new TorneoService(contractTorneo);
  const padelDBService = new PadelDBService();

  if (!web3) {
    console.log("No web3")
    return;
  }
  
  contadorService.increment(account).then( () => {
    contadorService.getCount().then(result => {
      setCount(result);
    });
  });

  torneoService.getPartidas().then(result => {
    console.log(result);
  });

  padelDBService.obtenerRegistros().then(data => {
    console.log(data);
  }).catch(error => {
    console.error('Error al obtener los registros:', error);
  });
};

  return (
    <>
      <body>
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-6 offset-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Contador</h5>
                  <div id="numero" className="display-1">{count}</div>
                  <Button type="primary" onClick={getValue} className="btn btn-primary mt-3">Geddt</Button>
                  <Button type="default" onClick={initializeWeb3} className="btn btn-primary mt-3 d-none">Metamask</Button>
                  <h1 id="account">{account}</h1>
                </div>
              </div>
            </div>
          </div>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item
                name="nombreTorneo"
                label="Nombre del Torneo"
                rules={[{ required: true, message: 'Por favor ingresa el nombre del torneo' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="fechas"
                label="Fechas"
                rules={[{ required: true, message: 'Por favor selecciona las fechas del torneo' }]}
            >
                <RangePicker showTime />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Crear</Button>
            </Form.Item>
        </Form>
        </div>
      </body>
    </>
  )
}

export default App
