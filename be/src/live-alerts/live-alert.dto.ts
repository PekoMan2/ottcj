import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Equals,
  IsEmail,
  IsIn,
  IsOptional,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import type { LiveAlertStatus } from './live-alert-subscription.entity';

export class CreateLiveAlertSubscriptionDto {
  @ApiPropertyOptional({ example: 'bezec@example.sk' })
  @IsEmail()
  @IsOptional()
  @MaxLength(254)
  email?: string;

  @ApiPropertyOptional({ example: '+421900000000' })
  @IsOptional()
  @Matches(/^\+[1-9]\d{7,14}$/u, {
    message: 'phone must use international E.164 format',
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
