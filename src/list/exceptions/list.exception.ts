import { HttpStatus } from '@nestjs/common';
import GlobalException from 'src/exceptions/GlobalException';

export class ContentAlreadyExistsException extends GlobalException {
  constructor() {
    super(HttpStatus.CONFLICT, `Content already exists in your list!`);
  }
}
export class ContentDoesNotException extends GlobalException {
  constructor() {
    super(HttpStatus.NOT_FOUND, `Content does not exist in your list!`);
  }
}
export class UserNotFoundException extends GlobalException {
  constructor() {
    super(HttpStatus.NOT_FOUND, `User not Found!`);
  }
}
