import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminSecretGuard } from './admin-secret.guard';

function contextWithAuthorization(value?: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        header: () => value,
      }),
    }),
  } as ExecutionContext;
}

describe('AdminSecretGuard', () => {
  const secret = 'a-secure-operator-secret';
  const guard = new AdminSecretGuard(
    new ConfigService({ TRACKING_SECRET: secret }),
  );

  it('accepts the configured bearer secret', () => {
    expect(
      guard.canActivate(contextWithAuthorization(`Bearer ${secret}`)),
    ).toBe(true);
  });

  it.each([undefined, 'Basic value', 'Bearer wrong-secret'])(
    'rejects invalid authorization %s',
    (authorization) => {
      expect(() =>
        guard.canActivate(contextWithAuthorization(authorization)),
      ).toThrow(UnauthorizedException);
    },
  );
});
