import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error.js";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  let appError: AppError;

  if (error instanceof ZodError) {
    appError = new AppError(
      400,
      "Error de validación en los datos ingresados",
      "VALIDATION_ERROR",
      error.issues.map((issue) => ({
        field: issue.path.map(String).join(".") || "body",
        message: issue.message,
      })),
    );
  } else if (error instanceof AppError) {
    appError = error;
  } else if (
    error instanceof SyntaxError &&
    "type" in error &&
    error.type === "entity.parse.failed"
  ) {
    appError = new AppError(
      400,
      "El cuerpo de la solicitud contiene un JSON inválido.",
      "INVALID_JSON",
    );
  } else {
    console.error("Error inesperado:", error);

    appError = new AppError(
      500,
      "Ocurrió un error interno en el servidor.",
      "INTERNAL_SERVER_ERROR",
    );
  }

  res.status(appError.status).json({
    status: appError.status,
    message: appError.message,
    code: appError.code,
    details: appError.details,
  });
};