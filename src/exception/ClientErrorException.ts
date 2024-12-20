export default class ClientErrorException {
  message: string;
  type: string;

  constructor(message: string) {
    this.message = message;
    this.type = 'client_error';
  }
}
