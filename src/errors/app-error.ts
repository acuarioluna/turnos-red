export interface ErrorDetail {
  field: string;
  message: string;
}

export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details: ErrorDetail[];

  constructor(
    status: number,
    message: string,
    code: string,
    details: ErrorDetail[] = [],
  ) {
    super(message);

    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}