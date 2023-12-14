import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response: Response<
      any,
      Record<string, any>
    > = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message;

    if (this.isDuplicateKeyError(exception)) {
      const columnName = this.extractTableName(exception.message);
      message = `Duplicate key violation on ${columnName} field`;
      status = HttpStatus.CONFLICT;
    }

    switch (exception.constructor) {
      case QueryFailedError: // this is a TypeOrm error
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;

        if (this.isDuplicateKeyError(exception)) {
          const columnName = this.extractTableName(exception.message);
          message = `Duplicate key violation on ${columnName} field`;
          status = HttpStatus.CONFLICT;
        }
        break;
      case EntityNotFoundError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = `${this.getEntityName(exception)} not found`;
        break;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private isDuplicateKeyError(exception: QueryFailedError): boolean {
    return exception.message.includes('Duplicate entry');
  }

  private extractTableName(errorMessage: string): string | null {
    // Extracting the table name from the error message (customize this based on your database error message format)
    const regex = /Duplicate entry '(.*?)' for key '(.*?)'/;
    const match = errorMessage.match(regex);
    return match ? match[1] : null;
  }

  private getEntityName(exception: EntityNotFoundError): string {
    // Extracting the entity name from the error message
    const match = exception.message.match(/entity of type "(.*?)" matching/);
    return match ? match[1] : 'unknown';
  }
}
