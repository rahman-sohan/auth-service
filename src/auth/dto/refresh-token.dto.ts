import { IsNotEmpty, IsJWT } from 'class-validator';
import { Transform } from 'class-transformer';

export class RefreshTokenDto {
    @IsNotEmpty()
    @IsJWT()
    @Transform(({ value }) => value?.trim())
    refreshToken: string;
}
