// oauth2.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class OAuth2Exception extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}
