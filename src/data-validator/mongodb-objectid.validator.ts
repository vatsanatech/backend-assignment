import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  import { Types } from 'mongoose';
  
  // validating Object id in params and query
  @ValidatorConstraint({ async: false })
  export class IsObjectIdConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean {
      return Types.ObjectId.isValid(value);
    }
  
    defaultMessage(validationArguments: ValidationArguments): string {
      // Use the provided property name in the error message
      return `Invalid ${validationArguments.property || 'Id'}`;
    }
  }
  
  export function IsObjectId(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsObjectIdConstraint,
      });
    };
  }
