import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AdminSecretGuard } from '../auth/admin-secret.guard';
import {
  CreateLiveAlertSubscriptionDto,
  ExportLiveAlertsQueryDto,
  LiveAlertSubscriptionIdDto,
  UpdateLiveAlertStatusDto,
} from './live-alert.dto';
import {
  LiveAlertsService,
  type PublicLiveAlertConfiguration,
} from './live-alerts.service';

@ApiTags('live alerts')
@Controller('live-alert-subscriptions')
export class LiveAlertsController {
  constructor(private readonly service: LiveAlertsService) {}

  @Get('config')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Get public live alert availability and capacity' })
  @ApiOkResponse({ description: 'Safe public channel availability.' })
  getConfiguration(): Promise<PublicLiveAlertConfiguration> {
    return this.service.getPublicConfiguration();
  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Register for a one-time run-start alert' })
  @ApiAcceptedResponse({ description: 'The registration was accepted.' })
  async subscribe(
    @Body() dto: CreateLiveAlertSubscriptionDto,
    @Ip() ipAddress: string,
  ): Promise<{ status: 'accepted' }> {
    await this.service.subscribe(dto, ipAddress);
    return { status: 'accepted' };
  }
}

@ApiBearerAuth()
@ApiTags('operator')
@Controller('admin/live-alert-subscriptions')
@UseGuards(AdminSecretGuard)
export class AdminLiveAlertsController {
  constructor(private readonly service: LiveAlertsService) {}

  @Get('export')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({
    summary: 'Export active contacts for manual Garmin transfer',
  })
  async export(
    @Query() query: ExportLiveAlertsQueryDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="live-alert-subscriptions.csv"',
    );
    response.type('text/csv; charset=utf-8');
    return this.service.exportCsv(query.status);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'The operational status was updated.' })
  async updateStatus(
    @Param() parameters: LiveAlertSubscriptionIdDto,
    @Body() dto: UpdateLiveAlertStatusDto,
  ): Promise<void> {
    await this.service.updateStatus(parameters.id, dto.status);
  }

  @Delete('expired')
  @ApiOkResponse({ description: 'Expired contact records were deleted.' })
  async purgeExpired(): Promise<{ deleted: number }> {
    return { deleted: await this.service.purgeExpired() };
  }
}
