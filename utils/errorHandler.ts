export class BaseError extends Error {
  public statusCode: number
  constructor(message?: string) {
    super(message)
    this.statusCode = 400 // default statusCode
  }
}

export class BadRequest extends BaseError {
  constructor(message: string) {
    super(message)
    this.statusCode = 400
  }
}