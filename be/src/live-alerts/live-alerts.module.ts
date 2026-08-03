import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSecretGuard } from '../auth/admin-secret.guard';
import { LiveAlertCryptoService } from './live-alert-crypto.service';
import { LiveAlertRateLimitService } from './live-alert-rate-limit.service';
import { LiveAlertSubscriptionEntity } from './live-alert-subscription.entity';
import {
  AdminLiveAlertsController,
  LiveAlertsController,
} from './live-alerts.controller';
import { LiveAlertsService } from './live-alerts.service';

@Module({
  imports: [TypeOrmModule.forFeature([LiveAlertSubscriptionEntity])],
  controllers: [LiveAlertsController, AdminLiveAlertsController],
  providers: [
    LiveAlertsService,
    LiveAlertCryptoService,
    LiveAlertRateLimitService,
    AdminSecretGuard,
  ],
})
export class LiveAlertsModule {}
