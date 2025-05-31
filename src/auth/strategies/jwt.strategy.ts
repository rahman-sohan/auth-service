import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { APP_CONFIG } from '../../config/default.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: APP_CONFIG.JWT_ACCESS_SECRET,
        });
    }

    async validate(payload: any) {
        return {
            id: payload.sub,
            email: payload.email,
            fullName: payload.fullName,
            role: payload.role,
        };
    }
}
