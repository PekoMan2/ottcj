import { Module } from '@nestjs/common';
import { DonioController } from './donio.controller';
import { DonioService } from './donio.service';

@Module({
  controllers: [DonioController],
  providers: [DonioService],
})
export class DonioModule {}
