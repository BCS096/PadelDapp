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
        try {
            return await this.contratoTorneo.methods.cerrarInscripciones().send({from: owner,  gas: '6721975'});
        } catch (error) {
            console.log(error);
        }
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