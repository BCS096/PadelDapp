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

const contratoTorneoAddress = '0x9E5f111c33bA45EBD0d278BaDb1A76AAf527993B';
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

const contratoPadelTokenAddress = "0xd02BAC614217fF78Fa5806dC9D8AFA66C72CB969";

const contratoPadelTokenABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol_",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "decimals_",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "initialBalance_",
          "type": "uint256"
        },
        {
          "internalType": "address payable",
          "name": "feeReceiver_",
          "type": "address"
        }
      ],
      "stateMutability": "payable",
      "type": "constructor",
      "payable": true
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Burn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
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
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
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
      "name": "decimals",
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
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "getAllowSell",
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
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
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
          "name": "num",
          "type": "uint256"
        }
      ],
      "name": "setAllowSell",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
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
      "name": "totalSupply",
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
          "internalType": "address",
          "name": "vendedor",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "jugador2",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "contratoTorneo",
          "type": "address"
        }
      ],
      "name": "pagarInscripcion",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "jugador",
          "type": "address"
        }
      ],
      "name": "recompensaRegistro",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "creadorTorneo",
          "type": "address"
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
        },
        {
          "internalType": "uint256",
          "name": "porcentajeJugadores",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "porcentajeClub",
          "type": "uint256"
        }
      ],
      "name": "recompensaTorneo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

const web3 = new Web3("http://localhost:7545");

const contractTorneo = new web3.eth.Contract(contratoTorneoABI, contratoTorneoAddress);
const contractPadelToken = new web3.eth.Contract(contratoPadelTokenABI, contratoPadelTokenAddress);

const torneo = new TorneoService(contractTorneo);

const token = new PadelTokenService(contractPadelToken);





web3.eth.getBalance("0x21de375EC55729ac0caA8bC7965A4252a5389206")
    .then(balance => {
        // El saldo se devuelve en Wei. Convertir a Ether (1 Ether = 10^18 Wei)
        const saldoEther = web3.utils.fromWei(balance, 'ether');
        console.log(`El saldo de la billetera en Ether es: ${saldoEther}`);
    })