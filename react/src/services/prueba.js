import Web3 from 'web3';

export class PadelTokenService {
  
    constructor(contract) {
        this.padelTokenContract = contract;
    }
  
    async getTotalSupply() {  // jugador
      return await this.padelTokenContract.methods.totalSupply().call();
    }
  
    async getBalanceOf(account) { // jugador
      return this.padelTokenContract.methods.balanceOf(account).call();
    }
  
    async transfer(comprador, vendedor, amount) { //jugador
      const weiValue = amount * 640000000000000;
      try {
        await this.padelTokenContract.methods.transfer(vendedor, amount).send({ from: comprador, value: weiValue });
      } catch (error) {
        console.error('An error occurred:', error);
        if (error.message.includes('La cantidad de ether enviada no es correcta')) {
          // Handle the specific error here
          console.error('The amount of ether sent is not correct.');
        }
        if (error.message.includes('El vendedor no admite la venta de tantos tokens')) {
          // Handle the specific error here
          console.error('The seller does not allow the sale of so many tokens.');
        }
      }
    }
  
    async getName() { //jugador
      return await this.padelTokenContract.methods.name().call();
    }
  
    async getSymbol() { //jugador
      return await this.padelTokenContract.methods.symbol().call();
    }
  
    async pagarInscripcion(jugador1, jugador2, contratoTorneo) { //jugador
      try {
        await this.padelTokenContract.methods.pagarInscripcion(jugador2, contratoTorneo).send({ from: jugador1, gas: 6721975 });
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  
    async recompensaRegistro(jugador) { //jugador
      try {
        await this.padelTokenContract.methods.recompensaRegistro(jugador).send({ from: "0x40E4b12F4EC01D96148c0beC096bFC649d93DD88" });
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  
    async getAllowSell(usuario) { //club
      return await this.padelTokenContract.methods.getAllowSell(usuario).call();
    }
  
    async setAllowSell(usuario, cantidad) { //club
      try {
        await this.padelTokenContract.methods.setAllowSell(cantidad).send({ from: usuario });
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  
  }

  export class TorneoService {

    constructor(contract) {
        this.contratoTorneo = contract;
    }
  
    async getName() {
        return await this.contratoTorneo.methods.getNombreTorneo().call();
    }

    async getOwner() {
        return await this.contratoTorneo.methods.getOwner().call();
    }

    async getFechaInicio() {
        return await this.contratoTorneo.methods.getFechaInicio().call();
    }

    async getFechaFin() {
        return await this.contratoTorneo.methods.getFechaFin().call();
    }

    async cerrarInscripciones(owner) {
        return await this.contratoTorneo.methods.cerrarInscripciones().send({from: owner,  gas: '6721975'});
    }

    async getPartidas() {
        return await this.contratoTorneo.methods.getPartidas().call();
    }

    async getEquipos() {
        return await this.contratoTorneo.methods.getEquipos().call();
    }

    async setResultado(numPartida, numEquipoPartidaGanador, resultado, owner) {
        return await this.contratoTorneo.methods.setResultado(numPartida, numEquipoPartidaGanador, resultado).send({from: owner,  gas: '6721975'});
    }

    async setHorario(numPartida, horario, owner) {
        return await this.contratoTorneo.methods.setHorario(numPartida, horario).send({from: owner, gas: '6721975'});
    }
}

const contratoTorneoAddress = '0x35B457523E7D03632fb179eE2db849097c180de1';
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
            "internalType": "string",
            "name": "ronda",
            "type": "string"
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
            "internalType": "string",
            "name": "resultado",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "horario",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "ganador",
            "type": "uint256"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
    "type": "function"
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
                "internalType": "string",
                "name": "ronda",
                "type": "string"
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
                "internalType": "string",
                "name": "resultado",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "horario",
                "type": "string"
              },
              {
                "internalType": "uint256",
                "name": "ganador",
                "type": "uint256"
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

const web3 = new Web3("http://localhost:7545");

const contractTorneo = new web3.eth.Contract(contratoTorneoABI, contratoTorneoAddress);

const torneo = new TorneoService(contractTorneo);


contractTorneo.methods.addEquipo('0x40E4b12F4EC01D96148c0beC096bFC649d93DD88', '0x21de375EC55729ac0caA8bC7965A4252a5389206').send({from: '0x40E4b12F4EC01D96148c0beC096bFC649d93DD88', gas: 6721975});
contractTorneo.methods.addEquipo('0xdF87A7D6c4b7e7d0e8B4E70dEd84c3Fa0c018165', '0x0215eDc0e5774437d5CCCb68bdDdb63c329Db75B').send({from: '0x40E4b12F4EC01D96148c0beC096bFC649d93DD88', gas: 6721975});
contractTorneo.methods.addEquipo('0x202694b8F0a7c890549534B4065E1F209612B32A', '0x507D7A5905460903A2dd88E79251a769755C8879').send({from: '0x40E4b12F4EC01D96148c0beC096bFC649d93DD88', gas: 6721975});
contractTorneo.methods.addEquipo('0xf84a7fF9EEc7cA4b7003ac99F0e7775Ea361c249', '0x24F9b5a49E81879BcC50C91133C18bf7C025DCFC').send({from: '0x40E4b12F4EC01D96148c0beC096bFC649d93DD88', gas: 6721975});
contractTorneo.methods.addEquipo('0x248b513a9945391283112cE6dE12F89482B8a2Ff', '0xc22678A618a3ba3b3E996025C32FC24A6EFA3800').send({from: '0x40E4b12F4EC01D96148c0beC096bFC649d93DD88', gas: 6721975});


//torneo.getPartidas().then(console.log);

//contractTorneo.methods.getPartidas().call().then(console.log);


//torneo.cerrarInscripciones('0x40E4b12F4EC01D96148c0beC096bFC649d93DD88').then(console.log);

