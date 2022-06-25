export class Failure {
  ok = false;

  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
