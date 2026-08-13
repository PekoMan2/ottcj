import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { siteContent } from './config/content';
import type { EventState } from './features/event/eventState';

const preEventState: EventState = {
  eventStartAt: '2026-08-13T08:00:00+02:00',
  liveTrackUrl: null,
  phase: 'pre',
  result: null,
};
const donioUrl = 'https://donio.sk/zachranme-vilyho/majo-od-tatier-k-dunaju';

function renderAt(path: string, eventState: EventState = preEventState) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App eventState={eventState} />
    </MemoryRouter>,
  );
}

describe('App routes', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-08-12T09:00:00+02:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the donation-first homepage at the root route', () => {
    const { container } = renderAt('/');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Od Tatier k Dunaju' }),
    ).toBeInTheDocument();
    expect(screen.getByText('do štartu:')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'bež so mnou. zachráňme Vilyho.' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('84 h').length).toBeGreaterThan(0);
    expect(container.querySelector('[data-site-phase="pre"]')).not.toBeNull();
  });

  it('links every donation CTA to the Donio challenge', () => {
    renderAt('/');

    const donateLinks = screen.getAllByRole('link', { name: /prispej/i });
    expect(donateLinks.length).toBeGreaterThanOrEqual(3);
    for (const link of donateLinks) {
      expect(link).toHaveAttribute('href', donioUrl);
      expect(link).toHaveAttribute('target', '_blank');
    }
  });

  it('shows the approximate campaign numbers with a link to Donio', () => {
    renderAt('/');

    const progress = screen.getByRole('complementary', { name: 'Stav zbierky Zachráňme Vilyho' });
    expect(within(progress).getByText('2 000 000 €')).toBeInTheDocument();
    expect(within(progress).getByText(/z\s*4 000 000 €/)).toBeInTheDocument();
    expect(within(progress).getByText(/približný stav/)).toBeInTheDocument();
    expect(within(progress).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
    expect(
      within(progress).getByRole('link', { name: 'donio.sk/zachranme-vilyho' }),
    ).toHaveAttribute('href', donioUrl);
  });

  it('renders the bet invitation with both time codes', () => {
    renderAt('/');

    expect(screen.getByText('bonus: stav si na môj čas')).toBeInTheDocument();
    expect(screen.getByText('(Majo čas: 73:30:00)')).toBeInTheDocument();
    expect(screen.getByText('(Majo čas: nedobehne)')).toBeInTheDocument();
    expect(screen.getByText('Uveď svoje reálne meno ;-)')).toBeInTheDocument();
  });

  it('opens and closes the mobile navigation accessibly', () => {
    renderAt('/');

    const menuButton = screen.getByRole('button', { name: 'Otvoriť navigáciu' });
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Hlavná navigácia' })).toHaveClass('site-nav--open');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveFocus();
  });

  it.each([
    [
      {
        eventStartAt: '2026-08-01T06:00:00+02:00',
        liveTrackUrl: null,
        phase: 'live',
        result: null,
      } satisfies EventState,
      'Majo behá už:',
    ],
    [
      {
        eventStartAt: preEventState.eventStartAt,
        liveTrackUrl: null,
        phase: 'post',
        result: {
          elapsedSeconds: null,
          finalDonationTotalEur: null,
          multiplier: 0,
          resultCopy: null,
          status: 'dnf',
        },
      } satisfies EventState,
      'fáza behu sa skončila',
    ],
  ] as const)('renders honest %s phase status', (runtimeState, status) => {
    const { container } = renderAt('/', runtimeState);

    expect(screen.getByText(status)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'bež so mnou. zachráňme Vilyho.' }),
    ).toBeInTheDocument();
    expect(container).not.toHaveTextContent(/aktuálna poloha|prejdené km|vyzbierané spolu/i);
  });

  it('links directly to Garmin while live and keeps the donation available', () => {
    renderAt('/', {
      ...preEventState,
      liveTrackUrl: 'https://livetrack.garmin.com/session/example',
      phase: 'live',
    });
    expect(screen.getByRole('link', { name: /sledovať Maja naživo/i })).toHaveAttribute(
      'href',
      'https://livetrack.garmin.com/session/example',
    );
    expect(screen.getByRole('link', { name: /kde práve som/i })).toHaveAttribute(
      'href',
      'https://livetrack.garmin.com/session/example',
    );
    expect(
      screen.getByRole('link', { name: /Majov Garmin tracking/i }),
    ).toHaveAttribute('href', 'https://livetrack.garmin.com/session/example');
    expect(
      screen.queryByRole('link', { name: 'upozorni ma pri štarte' }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /prispej/i }).length).toBeGreaterThan(0);
  });

  it('offers the Google Form notify card before the start instead of tracking links', () => {
    renderAt('/');

    expect(
      screen.getByRole('heading', { name: 'upozorni ma, keď Majo vybehne' }),
    ).toBeInTheDocument();
    const signupLink = screen.getByRole('link', { name: 'upozorni ma pri štarte' });
    expect(signupLink).toHaveAttribute(
      'href',
      'https://docs.google.com/forms/d/e/1FAIpQLSegRzumYZgOYlFeqTv3LtHKBqYCAIrzDHKDBrFOXDu5JQi2yA/viewform',
    );
    expect(signupLink).toHaveAttribute('target', '_blank');
    expect(
      screen.queryByRole('link', { name: /oficiálny Live-track/i }),
    ).not.toBeInTheDocument();
  });

  it('switches to tracking links once the start time has passed', () => {
    renderAt('/', { ...preEventState, eventStartAt: '2026-08-01T06:00:00+02:00' });

    expect(
      screen.queryByRole('link', { name: 'upozorni ma pri štarte' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'oficiálny Live-track OTKD sólo bežcov →' }),
    ).toHaveAttribute(
      'href',
      'https://sunbell.tracktherace.com/sk/sportove-udalosti/beh-v-prirode/od-tatier-k-dunaju-2026-solo/pretek',
    );
    expect(
      screen.getByRole('button', { name: /Majov Garmin tracking/i }),
    ).toBeDisabled();
  });

  it('renders the official post result and removes donation CTAs', () => {
    renderAt('/', {
      ...preEventState,
      phase: 'post',
      result: {
        elapsedSeconds: 58 * 3600,
        finalDonationTotalEur: 12500,
        multiplier: 2.5,
        resultCopy: 'Schválený výsledkový text.',
        status: 'finished',
      },
    });
    expect(screen.getByRole('heading', { name: 'Majo dobehol.' })).toBeInTheDocument();
    expect(screen.getByText('58 h 0 min 0 s')).toBeInTheDocument();
    expect(screen.getByText('12 500,00 €')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Teraz bež so mnou.' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Prispej Vilkovi/i }).length).toBe(1);
  });

  it('renders the remaining homepage sections in the specified editorial order', () => {
    const { container } = renderAt('/');

    expect(
      Array.from(container.querySelectorAll('main > section[id]')).map((section) => section.id),
    ).toEqual(['vily', 'trasa', 'pridaj-sa', 'pribeh', 'partneri', 'kontakt']);
    expect(screen.getByRole('heading', { name: '347,32 km krížom cez Slovensko.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Pridaj sa ku mne počas behu.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Môj bežecký príbeh.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Partneri.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Neboj sa, nekúšem.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Teraz bež so mnou.' })).toBeInTheDocument();
  });

  it('keeps every homepage navigation target valid and unique', () => {
    const { container } = renderAt('/');
    const ids = Array.from(container.querySelectorAll('[id]')).map((element) => element.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const anchor of container.querySelectorAll<HTMLAnchorElement>('a[href^="/#"]')) {
      const targetId = anchor.getAttribute('href')?.slice(2);
      expect(targetId).toBeTruthy();
      expect(document.getElementById(targetId!)).not.toBeNull();
    }
  });

  it('renders the rewritten route and story content', () => {
    renderAt('/');
    const hero = screen.getByRole('region', { name: '347 km sólo pre Zachráňme Vilyho' });

    expect(within(hero).getByRole('img', { name: 'Majo s vlajkou Slovenska po pretekoch' }))
      .toHaveAttribute('src', '/majo.jpg');
    expect(within(hero).getByText('Tyršovo nábrežie')).toBeInTheDocument();
    expect(
      screen.getByText(/Od štartu 13\. 8\. o 8:00 pred Hotelom Sorea Marmot/),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Šul/)).not.toBeInTheDocument();
    expect(screen.getByText('hlavný partner')).toBeInTheDocument();
    expect(screen.getByText('kto je Vilko?', { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/Vilko má 2 roky/)).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: 'IontMax' })[0]).toHaveAttribute(
      'src',
      '/iontmax.png',
    );
    expect(screen.getAllByRole('img', { name: 'Shokz slúchadlá' })[0]).toHaveAttribute(
      'src',
      '/shokz.png',
    );
    expect(screen.getAllByRole('img', { name: 'Daybyday Nitra' })[0]).toHaveAttribute(
      'src',
      '/daybyday.png',
    );
    expect(screen.getAllByRole('img', { name: 'All People Nitra' })[0]).toHaveAttribute(
      'src',
      '/allpeople.png',
    );
    expect(screen.getAllByRole('img', { name: 'Lisu' })[0]).toHaveAttribute('src', '/lisu.png');
    expect(screen.getAllByRole('img', { name: 'Reklamask' })[0]).toHaveAttribute(
      'src',
      '/reklamask.png',
    );
    expect(screen.getAllByRole('img', { name: 'Garmond Nitra' })[0]).toHaveAttribute(
      'src',
      '/garmondnitra.png',
    );
    expect(screen.getAllByRole('img', { name: 'Markíza' })[0]).toHaveAttribute(
      'src',
      '/markiza.png',
    );
    expect(screen.getAllByRole('img', { name: 'Refresher' })[0]).toHaveAttribute(
      'src',
      '/refresher.png',
    );
    expect(screen.getAllByRole('link', { name: 'Daybyday Nitra' })[0]).toHaveAttribute(
      'href',
      'https://daybday.sk/',
    );
    expect(screen.getAllByRole('link', { name: 'Reklamask' })[0]).toHaveAttribute(
      'href',
      'https://reklamask.sk/',
    );
    expect(screen.getAllByRole('link', { name: 'Garmond Nitra' })[0]).toHaveAttribute(
      'href',
      'https://garmondnitra.sk/',
    );
    expect(screen.getAllByText('mediálny partner')).toHaveLength(2);
    expect(screen.getByText(/tu môžeš byť ty/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'prečítaj celý rozhovor →' })).toHaveAttribute(
      'href',
      'https://refresher.sk/205038-23-rocny-Majo-kedysi-behal-len-pre-pivo-teraz-sa-chysta-zdolat-345-km-v-behu-Od-Tatier-k-Dunaju-Rozhovor',
    );
  });

  it('routes every contact through the single personal address', () => {
    renderAt('/');

    expect(screen.getAllByRole('link', { name: /majocrnkovic@gmail\.com/i })[0]).toHaveAttribute(
      'href',
      'mailto:majocrnkovic@gmail.com',
    );
    expect(screen.getByText('OSOBNE – NAJLEPŠIA FORMA')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: '@majo.crnkovic' })[0]).toHaveAttribute(
      'href',
      'https://www.instagram.com/majo.crnkovic/',
    );
    expect(screen.getAllByRole('link', { name: /@odtatierkdunaju/ })[0]).toHaveAttribute(
      'href',
      'https://www.instagram.com/odtatierkdunaju/',
    );
    expect(screen.getAllByRole('link', { name: /YouTube/ })[0]).toHaveAttribute(
      'href',
      'https://www.youtube.com/@uuultra.behyyy',
    );
    expect(screen.getByRole('link', { name: 'press kit →' })).toHaveAttribute('href', '/press');
  });

  it('keeps GDPR reachable for consent info but out of the footer', () => {
    renderAt('/');
    const footer = screen.getByRole('contentinfo');

    expect(within(footer).queryByRole('link', { name: 'GDPR' })).not.toBeInTheDocument();
    expect(within(footer).queryByRole('link', { name: 'tím' })).not.toBeInTheDocument();
    expect(within(footer).queryByRole('link', { name: /príspevk/ })).not.toBeInTheDocument();
    expect(within(footer).getByText('347 km sólo – zbierka pre Vilyho')).toBeInTheDocument();
    expect(within(footer).getAllByRole('img')).toHaveLength(
      siteContent.partners.list.filter((partner) => partner.logoMono ?? partner.logo).length,
    );
  });

  it('gives the footer silhouette a logo whose detail survives being flattened', () => {
    renderAt('/');

    expect(within(screen.getByRole('contentinfo')).getByRole('img', { name: 'Markíza' })).toHaveAttribute(
      'src',
      '/markiza-mono.png',
    );
  });

  it.each([
    ['/press', 'Press kit.'],
    ['/vily', 'Zachráňme Vilyho.'],
    ['/gdpr', 'GDPR informácie.'],
  ])('renders the supporting route %s', (path, heading) => {
    const { container } = renderAt(path);
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(container.querySelector('[data-site-phase="pre"]')).not.toBeNull();
  });

  it('keeps internal editorial status warnings off the Vily page', () => {
    const { container } = renderAt('/vily');
    expect(container).not.toHaveTextContent(/provisional|draft|unverified|čaká na schválenie|pracovný placeholder/i);
  });

  it('scrolls to the top after navigating to another page', () => {
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);

    renderAt('/');
    expect(scrollTo).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('link', { name: 'press' }));

    expect(screen.getByRole('heading', { name: 'Press kit.' })).toBeInTheDocument();
    expect(scrollTo).toHaveBeenCalledWith({ behavior: 'instant', left: 0, top: 0 });
    vi.unstubAllGlobals();
  });

  it('renders the deferred route-map boundary without eagerly loading Leaflet', () => {
    const { container } = renderAt('/');
    const map = container.querySelector('[data-route-map-state="idle"]');

    expect(map).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'interaktívna mapa trasy' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'načítať interaktívnu mapu' })).toBeInTheDocument();
    expect(container).not.toHaveTextContent(/Leaflet|OpenStreetMap|načítavam oficiálnu trasu/i);
  });

  it('renders the branded not-found route', () => {
    renderAt('/neexistuje');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Táto stránka tu nie je.' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'späť na domovskú stránku' }),
    ).toHaveAttribute('href', '/');
  });
});
