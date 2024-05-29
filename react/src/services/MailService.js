import axios from 'axios';

export class MailService {

  constructor() {}
  
  async sendMail(email, name, horario) {
    try {
      await axios.post('http://localhost:3001/email/sendMail', { email: email, name: name, horario: horario });
    } catch (error) {
      console.error('Error al enviar el email:', error);
    }
  }
}