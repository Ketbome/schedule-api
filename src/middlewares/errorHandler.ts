import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error("Error no controlado:", err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
  });
}
