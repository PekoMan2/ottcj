import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { EventState } from '../event/eventState';
import { TrackingPanel } from './TrackingPanel';

const preEventState: EventState = {
  eventStartAt: '2099-08-13T06:00:00+02:00',
  liveTrackUrl: null,
  phase: 'pre',
  result: null,
  updatedAt: null,
};

function mockFetch(status = 202) {
  const fetchMock = vi.fn(() =>
    Promise.resolve(new Response(null, { status })),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function openForm() {
  render(
    <MemoryRouter>
      <TrackingPanel eventState={preEventState} />
    </MemoryRouter>,
  );
  fireEvent.click(
    screen.getByRole('button', { name: 'upozorni ma pri štarte' }),
  );
}

function fillRequired(options: { email?: string; consent?: boolean } = {}) {
  fireEvent.change(screen.getByLabelText('meno'), {
    target: { value: ' Jana ' },
  });
  fireEvent.change(screen.getByLabelText('priezvisko'), {
    target: { value: 'Bežcová' },
  });
  if (options.email) {
    fireEvent.change(screen.getByLabelText('email'), {
      target: { value: options.email },
    });
  }
  if (options.consent !== false) {
    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'súhlasím so spracovaním osobných údajov',
      }),
    );
  }
}

function submit() {
  fireEvent.click(screen.getByRole('button', { name: 'pošli mi upozornenie' }));
}

function sentBody(fetchMock: ReturnType<typeof mockFetch>) {
  const [url, init] = fetchMock.mock.calls[0] as unknown as [
    string,
    RequestInit,
  ];
  expect(url).toBe('/api/live-alert-subscriptions');
  return JSON.parse(init.body as string) as Record<string, unknown>;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('TrackingPanel notify signup', () => {
  it('reveals the signup form after the notify button is clicked', () => {
    openForm();

    expect(screen.getByLabelText('meno')).toBeInTheDocument();
    expect(screen.getByLabelText('priezvisko')).toBeInTheDocument();
    expect(screen.getByLabelText('email')).toBeInTheDocument();
    expect(screen.getByLabelText('telefón')).toBeInTheDocument();
    expect(screen.getByLabelText('predvoľba krajiny')).toHaveValue('+421');
    expect(
      screen.getByRole('checkbox', {
        name: 'súhlasím so spracovaním osobných údajov',
      }),
    ).not.toBeChecked();
    expect(
      screen.getByRole('link', { name: 'ako s údajmi nakladáme →' }),
    ).toHaveAttribute('href', '/gdpr');
  });

  it('submits a trimmed email signup with explicit consent', async () => {
    const fetchMock = mockFetch();
    openForm();
    fillRequired({ email: 'jana@example.sk' });
    submit();

    expect(
      await screen.findByText('Hotovo, si na zozname!'),
    ).toBeInTheDocument();
    expect(sentBody(fetchMock)).toEqual({
      consent: true,
      email: 'jana@example.sk',
      firstName: 'Jana',
      lastName: 'Bežcová',
    });
  });

  it('joins the selected country prefix with the spaced phone number', async () => {
    const fetchMock = mockFetch();
    openForm();
    fillRequired();
    fireEvent.change(screen.getByLabelText('predvoľba krajiny'), {
      target: { value: '+420' },
    });
    fireEvent.change(screen.getByLabelText('telefón'), {
      target: { value: '605 123 456' },
    });
    submit();

    expect(
      await screen.findByText('Hotovo, si na zozname!'),
    ).toBeInTheDocument();
    expect(sentBody(fetchMock)).toEqual({
      consent: true,
      firstName: 'Jana',
      lastName: 'Bežcová',
      phone: '+420605123456',
    });
  });

  it('rejects a phone number that is not nine digits', () => {
    const fetchMock = mockFetch();
    openForm();
    fillRequired();
    fireEvent.change(screen.getByLabelText('telefón'), {
      target: { value: '12 34' },
    });
    submit();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Telefónne číslo musí mať 9 číslic po predvoľbe.',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('requires at least one contact channel', () => {
    const fetchMock = mockFetch();
    openForm();
    fillRequired();
    submit();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Vyplň email alebo telefónne číslo.',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('requires the privacy consent before submitting', () => {
    const fetchMock = mockFetch();
    openForm();
    fillRequired({ consent: false, email: 'jana@example.sk' });
    submit();

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Pred odoslaním potvrď súhlas so spracovaním údajov.',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('explains a full capacity instead of a generic failure', async () => {
    mockFetch(409);
    openForm();
    fillRequired({ email: 'jana@example.sk' });
    submit();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Kapacita upozornení je už plná.',
    );
    expect(
      screen.getByRole('button', { name: 'pošli mi upozornenie' }),
    ).toBeEnabled();
  });
});
