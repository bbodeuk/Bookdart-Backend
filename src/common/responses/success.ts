export class Success<T> {
  ok = true;

  data: T;

  constructor(data: T) {
    this.data = data;
  }
}
