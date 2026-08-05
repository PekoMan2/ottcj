import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  Equals,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import type { LiveAlertStatus } from './live-alert-subscription.entity';

const trimmed = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateLiveAlertSubscriptionDto {
  @ApiProperty({ example: 'Jana' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(trimmed)
  firstName!: string;

  @ApiProperty({ example: 'Bežcová' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(trimmed)
  lastName!: string;

  @ApiPropertyOptional({ example: 'bezec@example.sk' })
  @IsEmail()
  @IsOptional()
  @MaxLength(254)
  email?: string;

  @ApiPropertyOptional({ example: '+421900000000' })
  @IsOptional()
  @Matches(/^\+42[01]\d{9}$/u, {
    message: 'phone must be a Slovak (+421) or Czech (+420) number',
  })
  phone?: string;

  @ApiProperty({ example: true })
  @Equals(true)
  consent!: true;
}

export class UpdateLiveAlertStatusDto {
  @ApiProperty({ enum: ['pending', 'synced', 'rejected'] })
  @IsIn(['pending', 'synced', 'rejected'])
  status!: LiveAlertStatus;
}

export class ExportLiveAlertsQueryDto {
  @ApiPropertyOptional({ enum: ['pending', 'synced', 'rejected'] })
  @IsIn(['pending', 'synced', 'rejected'])
  @IsOptional()
  status?: LiveAlertStatus;
}

export class LiveAlertSubscriptionIdDto {
  @IsUUID()
  id!: string;
}
