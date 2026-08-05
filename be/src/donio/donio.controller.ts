import { Controller, Get, Header } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DonioService } from './donio.service';
import type { PublicDonioCampaign } from './donio.types';

@ApiTags('donio campaign')
@Controller('donio-campaign')
export class DonioController {
  constructor(private readonly service: DonioService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=60')
  @ApiOperation({ summary: 'Get the Donio fundraising totals' })
  @ApiOkResponse({ description: 'The latest known Donio campaign totals.' })
  getCampaign(): Promise<PublicDonioCampaign> {
    return this.service.getPublicCampaign();
  }
}
