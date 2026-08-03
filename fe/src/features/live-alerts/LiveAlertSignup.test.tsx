import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LiveAlertSignup } from './LiveAlertSignup';

const emailOnlyConfiguration = {
  channels: {
    email: { available: true, capacity: 50, remaining: 49 },
    sms: { available: false, capacity: 0, remaining: 0 },
  },
  consentVersion: '2026-08-04',
  enabled: true,
} as const;

afterEach(() => vi.restoreAllMocks());

describe('LiveAlertSignup', () => {
  it('does not collect contacts before approved consent exists', () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    render(
      <MemoryRouter>
        <LiveAlertSignup />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Registráciu spustíme po schválení súhlasu/i)).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits only the selected contact after explicit consent', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ status: 'accepted' }), {
        status: 202,
      }),
    );
    render(
      <MemoryRouter>
        <LiveAlertSignup
          consentText="Schválený text súhlasu."
          consentVersion="2026-08-04"
          initialConfiguration={emailOnlyConfiguration}
        />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByRole('textbox', { name: /^E-mail/ }), {
      target: { value: 'runner@example.sk' },
    });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /upozorniť pri štarte/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [, options] = fetchMock.mock.calls[0];
    expect(options?.method).toBe('POST');
    expect(JSON.parse(String(options?.body))).toEqual({
      consent: true,
      email: 'runner@example.sk',
    });
    expect(await screen.findByText(/Kontakt pred štartom bezpečne prenesieme/i)).toBeInTheDocument();
  });

  it('refuses submission without checking the approved consent', () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    render(
      <MemoryRouter>
        <LiveAlertSignup
          consentText="Schválený text súhlasu."
          consentVersion="2026-08-04"
          initialConfiguration={emailOnlyConfiguration}
        />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByRole('textbox', { name: /^E-mail/ }), {
      target: { value: 'runner@example.sk' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /upozorniť pri štarte/i }).closest('form')!);
    expect(screen.getByText(/potrebný schválený súhlas/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not collect contacts when frontend and backend consent versions differ', () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    render(
      <MemoryRouter>
        <LiveAlertSignup
          consentText="Schválený text súhlasu."
          consentVersion="2026-08-05"
          initialConfiguration={emailOnlyConfiguration}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText(/zosúladenie schválenej verzie súhlasu/i)).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
