import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/users.entity';
import { jwtConstants } from '../constants';

interface JwtPayload {
    iat: number; // Issued at (UNIX timestamp)
    exp: number; // Expiration time (UNIX timestamp)
    // Add other custom properties that you include in the JWT payload
    user: User;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: JwtPayload) {
        return payload.user;
    }
}
