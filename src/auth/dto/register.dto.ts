import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @Transform(({ value }) => value?.trim())
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @Transform(({ value }) => value?.trim())
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value?.trim().toLowerCase())
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    @Transform(({ value }) => value?.trim())
    password: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;
}
