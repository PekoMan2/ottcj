import { Body, Controller, Get, Header, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AdminSecretGuard } from '../auth/admin-secret.guard';
import { EventStateService } from './event-state.service';
import type { PublicEventState } from './event-state.types';
import { UpdateEventStateDto } from './update-event-state.dto';

@ApiTags('event state')
@Controller('event-state')
export class EventStateController {
  constructor(private readonly service: EventStateService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Get the public run lifecycle state' })
  @ApiOkResponse({ description: 'The current public lifecycle state.' })
  getPublicState(): Promise<PublicEventState> {
    return this.service.getPublicState();
  }
}

@ApiBearerAuth()
@ApiTags('operator')
@Controller('admin/event-state')
@UseGuards(AdminSecretGuard)
export class AdminEventStateController {
  constructor(private readonly service: EventStateService) {}

  @Put()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Replace the operational run lifecycle state' })
  @ApiOkResponse({ description: 'The updated public lifecycle state.' })
  update(@Body() dto: UpdateEventStateDto): Promise<PublicEventState> {
    return this.service.update(dto);
  }
}
