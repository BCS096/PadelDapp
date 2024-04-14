import TorneoJSON from '../assets/contracts/Torneo.json';

export class CreateTorneoService {
    
    static TOKEN_CONTRACT = "0xB7073aEed4e5151f3339465Ab2894a7b1751349e";

    constructor(web3) {
        this.web3 = web3;
    }
  
    async createTorneo(nombreTorneo, fechaInicio, fechaFin, owner) {
        const contract = new this.web3.eth.Contract(TorneoJSON.abi);
        const deploy = contract.deploy({
            data: TorneoJSON.bytecode,
            arguments: [CreateTorneoService.TOKEN_CONTRACT, nombreTorneo, fechaInicio, fechaFin]
        });

        const deployedContract = await deploy.send({
            from: owner,
            gas: 5000000
        });

        return deployedContract.options.address;
    }
}