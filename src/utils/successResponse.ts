import { HttpStatus } from '@nestjs/common';

// success response function to ensure consistent data returned to the client
export function successResponse(
  status: number = HttpStatus.OK,
  message = 'Success',
  data: unknown = null,
) {
  return {
    status,
    message,
    data,
  };
}
