export default class ClientErrorException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ClientErrorException';
  }
}
