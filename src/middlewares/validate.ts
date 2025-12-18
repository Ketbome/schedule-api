import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validate<T extends z.ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      res.status(400).json({
        success: false,
        message: "Validation error",
        details: errors,
      });
      return;
    }

    req.body = result.data;
    next();
  };
}
