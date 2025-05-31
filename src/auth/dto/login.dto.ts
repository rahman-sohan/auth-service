import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value?.trim().toLowerCase())
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
