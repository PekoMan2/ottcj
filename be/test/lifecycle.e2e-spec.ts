import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AdminSecretGuard } from '../src/auth/admin-secret.guard';
import {
  AdminEventStateController,
  EventStateController,
} from '../src/event-state/event-state.controller';
import { EventStateService } from '../src/event-state/event-state.service';
import {
  AdminLiveAlertsController,
  LiveAlertsController,
} from '../src/live-alerts/live-alerts.controller';
import { LiveAlertsService } from '../src/live-alerts/live-alerts.service';

const operatorSecret = 'test-operator-secret-value';
const preState = {
  eventStartAt: '2026-08-13T04:00:00.000Z',
  liveTrackUrl: null,
  phase: 'pre' as const,
  result: null,
  updatedAt: null,
};

describe('Lifecycle and live alerts (e2e)', () => {
  let app: INestApplication<App>;
  const eventStateService = {
    getPublicState: jest.fn(() => Promise.resolve(preState)),
    update: jest.fn((body: unknown) =>
      Promise.resolve({ ...preState, ...(body as object) }),
    ),
  };
  const liveAlertsService = {
    exportCsv: jest.fn(() => Promise.resolve('"id","contact"')),
    getPublicConfiguration: jest.fn(() =>
      Promise.resolve({
        channels: {
          email: { available: true, capacity: 50, remaining: 49 },
          sms: { available: false, capacity: 0, remaining: 0 },
        },
        consentVersion: '2026-08-04',
        enabled: true,
      }),
    ),
    purgeExpired: jest.fn(() => Promise.resolve(0)),
    subscribe: jest.fn(() => Promise.resolve()),
    updateStatus: jest.fn(() => Promise.resolve()),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [
        EventStateController,
        AdminEventStateController,
        LiveAlertsController,
        AdminLiveAlertsController,
      ],
      providers: [
        AdminSecretGuard,
        {
          provide: ConfigService,
          useValue: new ConfigService({ TRACKING_SECRET: operatorSecret }),
        },
        { provide: EventStateService, useValue: eventStateService },
        { provide: LiveAlertsService, useValue: liveAlertsService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
      }),
    );
    await app.init();
  });

  it('publishes the runtime event state', async () => {
    await request(app.getHttpServer())
      .get('/api/event-state')
      .expect(200)
      .expect(preState);
  });

  it('protects event state changes with the operator secret', async () => {
    await request(app.getHttpServer())
      .put('/api/admin/event-state')
      .send({
        phase: 'live',
        liveTrackUrl: 'https://livetrack.garmin.com/session/example',
      })
      .expect(401);

    await request(app.getHttpServer())
      .put('/api/admin/event-state')
      .set('Authorization', `Bearer ${operatorSecret}`)
      .send({
        phase: 'live',
        liveTrackUrl: 'https://livetrack.garmin.com/session/example',
      })
      .expect(200);
    expect(eventStateService.update).toHaveBeenCalledWith({
      liveTrackUrl: 'https://livetrack.garmin.com/session/example',
      phase: 'live',
    });
  });

  it('accepts a consented contact without returning private data', async () => {
    await request(app.getHttpServer())
      .post('/api/live-alert-subscriptions')
      .send({
        consent: true,
        email: 'runner@example.sk',
        firstName: 'Jana',
        lastName: 'Bežcová',
      })
      .expect(202)
      .expect({ status: 'accepted' });
    expect(liveAlertsService.subscribe).toHaveBeenCalledWith(
      {
        consent: true,
        email: 'runner@example.sk',
        firstName: 'Jana',
        lastName: 'Bežcová',
      },
      expect.any(String),
    );
  });

  it('publishes capacity without contacts or subscription identifiers', async () => {
    await request(app.getHttpServer())
      .get('/api/live-alert-subscriptions/config')
      .expect(200)
      .expect({
        channels: {
          email: { available: true, capacity: 50, remaining: 49 },
          sms: { available: false, capacity: 0, remaining: 0 },
        },
        consentVersion: '2026-08-04',
        enabled: true,
      });
  });

  it.each([
    [
      'email',
      {
        consent: true,
        email: 'not-an-email',
        firstName: 'Jana',
        lastName: 'Bežcová',
      },
    ],
    [
      'national-format phone',
      {
        consent: true,
        phone: '0900 000 000',
        firstName: 'Jana',
        lastName: 'Bežcová',
      },
    ],
    [
      'non Slovak or Czech phone',
      {
        consent: true,
        phone: '+491511234567',
        firstName: 'Jana',
        lastName: 'Bežcová',
      },
    ],
    ['nameless', { consent: true, email: 'runner@example.sk' }],
  ])(
    'rejects an invalid %s contact before it reaches the service',
    async (_label, body) => {
      const callsBefore = liveAlertsService.subscribe.mock.calls.length;
      await request(app.getHttpServer())
        .post('/api/live-alert-subscriptions')
        .send(body)
        .expect(400);
      expect(liveAlertsService.subscribe).toHaveBeenCalledTimes(callsBefore);
    },
  );

  it('rejects unsupported public fields before they reach the service', async () => {
    await request(app.getHttpServer())
      .post('/api/live-alert-subscriptions')
      .send({
        consent: true,
        email: 'runner@example.sk',
        firstName: 'Jana',
        lastName: 'Bežcová',
        privateMessage: 'secret',
      })
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
