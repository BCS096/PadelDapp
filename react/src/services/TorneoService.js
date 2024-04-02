export class TorneoService {

    constructor(contract) {
        this.contratoTorneo = contract;
    }
  
    // Método para obtener el número de jugadores registrados en el torneo
    async getName() {
        return await this.contratoTorneo.methods.getNombreTorneo().call();
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