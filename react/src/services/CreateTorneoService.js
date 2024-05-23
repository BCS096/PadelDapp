import TorneoJSON from '../assets/contracts/Torneo.json';

export class CreateTorneoService {
    
    static TOKEN_CONTRACT = "0xd02BAC614217fF78Fa5806dC9D8AFA66C72CB969";

    constructor(web3) {
        this.web3 = web3;
    }
  
    async createTorneo(nombreTorneo, fechaInicio, fechaFin, owner, { signal } = {}) {
        const contract = new this.web3.eth.Contract(TorneoJSON.abi);
        const deploy = contract.deploy({
          data: TorneoJSON.bytecode,
          arguments: [CreateTorneoService.TOKEN_CONTRACT, nombreTorneo, fechaInicio, fechaFin]
        });
    
        const sendPromise = deploy.send({
          from: owner,
          gas: 5000000
        });
    
        if (signal) {
          signal.addEventListener('abort', () => {
            sendPromise.catch(() => {}); // Prevenir unhandled promise rejection
          });
        }
    
        try {
          const deployedContract = await sendPromise;
          return deployedContract.options.address;
        } catch (error) {
          // Manejo de errores específicos
          if (error.message.includes('MetaMask') || error.message.includes('User denied transaction signature')) {
            throw new Error('La operación fue rechazada por el usuario en MetaMask.');
          } else if (error.message.includes('network error') || error.message.includes('Failed to fetch')) {
            throw new Error('Problema de conexión con la blockchain. Por favor, verifica tu conexión.');
          } else {
            throw new Error(`Error al desplegar el contrato: ${error.message}`);
          }
        }
      }
}