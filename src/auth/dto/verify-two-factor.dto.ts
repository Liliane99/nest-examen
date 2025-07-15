import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class VerifyTwoFactorDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @ApiProperty({ example: '123456', description: '6-digit 2FA code' })
  @IsString()
  @Length(6, 6)
  code: string;
}
