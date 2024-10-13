import GlobalException from 'src/exceptions/GlobalException';
import { HttpStatus } from '@nestjs/common';

export class TVShowDoesNotExistException extends GlobalException {
  constructor() {
    super(HttpStatus.NOT_FOUND, 'TV Show Does not exist');
  }
}
