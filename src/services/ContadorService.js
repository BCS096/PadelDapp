export class ContadorService { 
    constructor(contract) {
        this.contadorContract = contract;
    }
    
    async getCount() {
        return await this.contadorContract.methods.getCount().call();
    }
    
    async increment(who) {
        return await this.contadorContract.methods.increment().send({ from: who });
    }
}