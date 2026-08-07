import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { EventState } from '../event/eventState';
import { TrackingPanel } from './TrackingPanel';

const googleFormUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSegRzumYZgOYlFeqTv3LtHKBqYCAIrzDHKDBrFOXDu5JQi2yA/viewform';

const preEventState: EventState = {
  eventStartAt: '2099-08-13T08:00:00+02:00',
  liveTrackUrl: null,
  phase: 'pre',
  result: null,
};

describe('TrackingPanel', () => {
  it('links the notify signup to the Google Form before the start', () => {
    render(<TrackingPanel eventState={preEventState} />);

    const signupLink = screen.getByRole('link', {
      name: 'upozorni ma pri štarte',
    });
    expect(signupLink).toHaveAttribute('href', googleFormUrl);
    expect(signupLink).toHaveAttribute('target', '_blank');
    expect(
      screen.queryByRole('link', { name: /oficiálny Live-track/i }),
    ).not.toBeInTheDocument();
  });

  it('shows the tracking links with a pending Garmin note after the start', () => {
    render(
      <TrackingPanel
        eventState={{ ...preEventState, eventStartAt: '2020-08-13T08:00:00+02:00' }}
      />,
    );

    expect(
      screen.queryByRole('link', { name: 'upozorni ma pri štarte' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /oficiálny Live-track/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Majov Garmin tracking/i }),
    ).toBeDisabled();
  });

  it('links to the Garmin session while live', () => {
    render(
      <TrackingPanel
        eventState={{
          ...preEventState,
          eventStartAt: '2020-08-13T08:00:00+02:00',
          liveTrackUrl: 'https://livetrack.garmin.com/session/example',
          phase: 'live',
        }}
      />,
    );

    expect(
      screen.getByRole('link', { name: /Majov Garmin tracking/i }),
    ).toHaveAttribute('href', 'https://livetrack.garmin.com/session/example');
  });
});
