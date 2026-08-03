import { calculateEventMultiplier } from './event-state.types';

describe('calculateEventMultiplier', () => {
  it.each([
    ['dnf', null, 0],
    ['finished', 84 * 3600, 1],
    ['finished', 76 * 3600, 1],
    ['finished', 76 * 3600 - 1, 1.5],
    ['finished', 68 * 3600, 1.5],
    ['finished', 68 * 3600 - 1, 2],
    ['finished', 60 * 3600, 2],
    ['finished', 60 * 3600 - 1, 2.5],
  ] as const)('maps %s at %s seconds to %s×', (status, seconds, expected) => {
    expect(calculateEventMultiplier(status, seconds)).toBe(expected);
  });

  it('rejects a finished result without elapsed time', () => {
    expect(() => calculateEventMultiplier('finished', null)).toThrow(
      RangeError,
    );
  });
});
