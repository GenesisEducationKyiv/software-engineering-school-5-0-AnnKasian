abstract class BaseException extends Error {
  public abstract code: string;
  public abstract statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export { BaseException };
