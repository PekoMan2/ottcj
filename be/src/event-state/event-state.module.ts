import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSecretGuard } from '../auth/admin-secret.guard';
import {
  AdminEventStateController,
  EventStateController,
} from './event-state.controller';
import { EventStateEntity } from './event-state.entity';
import { EventStateService } from './event-state.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventStateEntity])],
  controllers: [EventStateController, AdminEventStateController],
  providers: [EventStateService, AdminSecretGuard],
  exports: [EventStateService],
})
export class EventStateModule {}
