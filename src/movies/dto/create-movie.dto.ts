import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'The Matrix' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'ne sais pas', required: false })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({ example: 1999, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 5)
  year?: number;

  @ApiProperty({ example: 'Sci-Fiction', required: false })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  rating?: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  watched?: boolean;

  @ApiProperty({ example: '2024-01-15T10:30:00Z', required: false })
  @IsOptional()
  @IsDateString()
  watchedAt?: string;

  @ApiProperty({ example: 'Bof', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
