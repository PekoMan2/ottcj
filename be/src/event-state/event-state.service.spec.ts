import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Repository } from 'typeorm';
import { EventStateEntity } from './event-state.entity';
import { EventStateService } from './event-state.service';

function createRepository() {
  let stored: EventStateEntity | null = null;
  const repository = {
    create: jest.fn((value: Partial<EventStateEntity>) =>
      Object.assign(new EventStateEntity(), value),
    ),
    findOneBy: jest.fn(() => Promise.resolve(stored)),
    save: jest.fn((value: EventStateEntity) => {
      value.updatedAt = new Date('2026-08-04T10:00:00.000Z');
      stored = value;
      return Promise.resolve(value);
    }),
  };
  return repository;
}

describe('EventStateService', () => {
  function createService() {
    const repository = createRepository();
    const service = new EventStateService(
      repository as unknown as Repository<EventStateEntity>,
      new ConfigService({ EVENT_START_AT: '2026-08-13T06:00:00+02:00' }),
    );
    return { repository, service };
  }

  it('returns a truthful pre-event default without inserting a row', async () => {
    const { repository, service } = createService();
    await expect(service.getPublicState()).resolves.toEqual({
      eventStartAt: '2026-08-13T04:00:00.000Z',
      liveTrackUrl: null,
      phase: 'pre',
      result: null,
      updatedAt: null,
    });
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('publishes only a secure Garmin URL during live phase', async () => {
    const { service } = createService();
    const state = await service.update({
      liveTrackUrl: 'https://livetrack.garmin.com/session/example',
      phase: 'live',
    });
    expect(state.liveTrackUrl).toBe(
      'https://livetrack.garmin.com/session/example',
    );
    await expect(
      service.update({
        liveTrackUrl: 'https://example.com/session',
        phase: 'live',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('publishes the official post result and calculated multiplier', async () => {
    const { service } = createService();
    const state = await service.update({
      elapsedSeconds: 58 * 3600,
      finalDonationTotalEur: 12500.5,
      phase: 'post',
      resultCopy: 'Schválený výsledkový text.',
      resultStatus: 'finished',
    });
    expect(state).toMatchObject({
      liveTrackUrl: null,
      phase: 'post',
      result: {
        elapsedSeconds: 58 * 3600,
        finalDonationTotalEur: 12500.5,
        multiplier: 2.5,
        resultCopy: 'Schválený výsledkový text.',
        status: 'finished',
      },
    });
  });

  it('requires an official result before switching to post phase', async () => {
    const { service } = createService();
    await expect(service.update({ phase: 'post' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
