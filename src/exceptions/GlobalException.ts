import { HttpException } from '@nestjs/common';

// Global Exception Class to send extra data (eg: redirect url, additional Messages etc.)
class GlobalException extends HttpException {
  statusCode: number;
  error: string;
  data: unknown;
  constructor(statusCode: number, error: string, data: unknown = null) {
    super(error, statusCode);
    this.data = data;
    this.statusCode = statusCode;
    this.error = error;
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  getResponse(): string {
    return this.error;
  }

  getData() {
    return this.data;
  }
}

export default GlobalException;
