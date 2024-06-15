export class PadelTokenService {
  
    constructor(contract) {
        this.padelTokenContract = contract;
    }
  
    async getTotalSupply() {  // jugador
      return await this.padelTokenContract.methods.totalSupply().call();
    }
  
    async getBalanceOf(account) { // jugador y club
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
          throw error;
        }
        if (error.message.includes('El vendedor no admite la venta de tantos tokens')) {
          // Handle the specific error here
          console.error('The seller does not allow the sale of so many tokens.');
          throw error;
        }
        throw error;
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
        throw error;
      }
    }
  
    async recompensaRegistro(jugador) { //jugador
      try {
        await this.padelTokenContract.methods.recompensaRegistro().send({ from: jugador });
      } catch (error) {
        console.error('An error occurred:', error);
        throw error;
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
        throw error;
      }
    }
  
  }