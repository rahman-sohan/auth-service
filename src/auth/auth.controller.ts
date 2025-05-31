import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async registerNewUser(@Body() registerPayload: RegisterDto) {
        return this.authService.signupNewUser(registerPayload);
    }

    @Post('login')
    async userLogin(@Body() loginPayload: LoginDto) {
        return this.authService.userLogin(loginPayload);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async userLogout(@Req() req) {
        return this.authService.logout(req.user.id);
    }

    @Post('refresh-token')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('validate')
    async validateToken(@Req() req) {        
        return this.authService.validateToken(req.user);
    }
}
