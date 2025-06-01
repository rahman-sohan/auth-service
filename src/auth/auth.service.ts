import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { APP_CONFIG } from '../config/default.config';
import { MessageBrokerRabbitmqService } from 'src/message-broker-rabbitmq/message-broker-rabbitmq.service';
import { MessagePatterns } from '../common/constants/message-patterns';

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService,
        private readonly rabbitMqService: MessageBrokerRabbitmqService,
    ) {}

    async signupNewUser(registerPayload: RegisterDto) {
        const existingUser = await this.databaseService.findUserByEmail(registerPayload.email);
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(registerPayload.password, 10);

        const user = await this.databaseService.createNewUser({
            ...registerPayload,
            password: hashedPassword,
        });

        if (!user) {
            throw new BadRequestException('Failed to create user');
        }
        const userId = (user as any)._id?.toString();

        this.rabbitMqService.publishToAuthExchange({
            pattern: MessagePatterns.USER_CREATED,
            data: {
                id: userId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        });

        const tokens = this.generateTokens(user);

        return {
            user: {
                id: userId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            ...tokens,
        };
    }

    async userLogin(loginPayload: LoginDto) {
        const user = await this.databaseService.findUserByEmail(loginPayload.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginPayload.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        await this.databaseService.updateUser(user._id.toString(), {
            lastLogin: new Date(),
        });

        const tokens = this.generateTokens(user);
        const userId = (user as any)._id?.toString();

        return {
            user: {
                id: userId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            ...tokens,
        };
    }

    async logout(userId: string) {
        return { success: true };
    }

    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: APP_CONFIG.JWT_REFRESH_SECRET,
            });

            const user = await this.databaseService.findUserById(payload.sub);
            const tokens = this.generateTokens(user);

            return tokens;
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async validateToken(tokenOrUser: any) {
        try {
            let userId;

            if (typeof tokenOrUser === 'string') {
                const payload = this.jwtService.verify(tokenOrUser, {
                    secret: APP_CONFIG.JWT_ACCESS_SECRET,
                });
        
                userId = payload.sub;
            }

            const userFromDb = await this.databaseService.findUserById(userId);
            if (!userFromDb) {
                throw new UnauthorizedException('User not found');
            }

            this.rabbitMqService.publishToAuthExchange({
                pattern: MessagePatterns.TOKEN_VALIDATION_RESPONSE,
                data: {
                    idValid: true,
                    id: userFromDb._id.toString(),
                    email: userFromDb.email,
                    firstName: userFromDb.firstName,
                    lastName: userFromDb.lastName,
                    role: userFromDb.role,
                },
            });
            
        } catch (error) {
            console.error('Token validation error:', error);
            this.rabbitMqService.publishToAuthExchange({
                pattern: MessagePatterns.TOKEN_VALIDATION_RESPONSE,
                data: {
                    idValid: false,
                    error: error.message || 'Token validation failed'
                },
            });
        }
    }

    private generateTokens(user) {
        const userId = (user as any)._id?.toString();
        if (!userId) {
            throw new BadRequestException('User ID is required to generate tokens');
        }
        const payload = {
            sub: userId,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        };

        return {
            accessToken: this.jwtService.sign(payload, {
                secret: APP_CONFIG.JWT_ACCESS_SECRET,
                expiresIn: APP_CONFIG.JWT_ACCESS_EXPIRY,
            }),

            refreshToken: this.jwtService.sign(payload, {
                secret: APP_CONFIG.JWT_REFRESH_SECRET,
                expiresIn: APP_CONFIG.JWT_REFRESH_EXPIRY,
            }),
        };
    }
}
