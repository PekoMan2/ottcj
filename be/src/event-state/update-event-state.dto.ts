import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsISO8601,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import type { EventPhase, EventResultStatus } from './event-state.entity';

export class UpdateEventStateDto {
  @ApiProperty({ enum: ['pre', 'live', 'post'] })
  @IsIn(['pre', 'live', 'post'])
  phase!: EventPhase;

  @ApiPropertyOptional({ example: '2026-08-13T06:00:00+02:00' })
  @IsISO8601({ strict: true })
  @IsOptional()
  eventStartAt?: string;

  @ApiPropertyOptional({
    example: 'https://livetrack.garmin.com/session/example',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  liveTrackUrl?: string | null;

  @ApiPropertyOptional({ enum: ['finished', 'dnf'], nullable: true })
  @IsIn(['finished', 'dnf'])
  @IsOptional()
  resultStatus?: EventResultStatus | null;

  @ApiPropertyOptional({ example: 208800, nullable: true })
  @IsInt()
  @Min(0)
  @Max(302400)
  @IsOptional()
  elapsedSeconds?: number | null;

  @ApiPropertyOptional({ example: 12500, nullable: true })
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Min(0)
  @Max(21_000_000)
  @IsOptional()
  finalDonationTotalEur?: number | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  resultCopy?: string | null;
}
