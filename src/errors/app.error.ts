export class AppError extends Error {
  constructor(public statusCode: number, public message: string, public isOperational = true) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static badRequest(msg: string) {
    return new AppError(400, msg);
  }

  static notFound(msg: string) {
    return new AppError(404, msg);
  }

  static internalServerError(msg: string) {
    return new AppError(500, msg);
  }
}
