import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import type { HealthStatus } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check API health' })
  @ApiOkResponse({
    description: 'The API is available.',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2026-08-02T12:00:00.000Z',
      },
    },
  })
  getHealth(): HealthStatus {
    return this.appService.getHealth();
  }
}
