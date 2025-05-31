import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Types } from 'mongoose';
import { APP_CONFIG } from '../config/default.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.databaseService.findUserByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.databaseService.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    // Emit user created event
    this.eventEmitter.emit('user.created', {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.databaseService.findUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login time
    await this.databaseService.updateUser(user._id.toString(), { 
      lastLogin: new Date() 
    });

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      ...tokens,
    };
  }

  async logout(userId: string) {
    // In a real app, we might invalidate the refresh token here
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

  private generateTokens(user) {
    const payload = { 
      email: user.email, 
      sub: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
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
