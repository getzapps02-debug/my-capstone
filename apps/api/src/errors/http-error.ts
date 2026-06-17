export class HttpError extends Error {
  readonly code: string
  readonly statusCode: number
  readonly details?: unknown

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: unknown
  ) {
    super(message)
    this.code = code
    this.statusCode = statusCode
    this.details = details
  }
}
