import GlobalException from 'src/exceptions/GlobalException';
import { HttpStatus } from '@nestjs/common';

export class MovieNotExistException extends GlobalException {
  constructor() {
    super(HttpStatus.NOT_FOUND, 'Movie Does not exist');
  }
}
