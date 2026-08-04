import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import type { SiteConfig } from './config/site';
import type { EventState } from './features/event/eventState';
import type { PublicPledgeData } from './features/pledge/publicPledges';

const defaultConfig: SiteConfig = {};
const preEventState: EventState = {
  eventStartAt: '2026-08-13T06:00:00+02:00',
  liveTrackUrl: null,
  phase: 'pre',
  result: null,
  updatedAt: null,
};
const emptyPledges: PublicPledgeData = { pledges: [], updatedAt: null };

function renderAt(
  path: string,
  config: SiteConfig = defaultConfig,
  initialPledgeData: PublicPledgeData = emptyPledges,
  initialEventState: EventState = preEventState,
) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App
        config={config}
        initialEventState={initialEventState}
        initialPledgeData={initialPledgeData}
      />
    </MemoryRouter>,
  );
}

describe('App routes', () => {
  it('renders the complete pledge-first homepage at the root route', () => {
    const { container } = renderAt('/');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Od Tatier k Dunaju' }),
    ).toBeInTheDocument();
    expect(screen.getByText('do štartu:')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'bež so mnou. zachráňme Vilyho.' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('84 h').length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('button', { name: /prispej na liečbu — formulár pripravujeme/i })[0],
    ).toBeDisabled();
    expect(container.querySelector('[data-site-phase="pre"]')).not.toBeNull();
    expect(container.querySelector('[data-pledge-status="ready"]')).toHaveTextContent('0 ľudí prispelo');
  });

  it('opens the configured pledge form from every primary CTA', () => {
    renderAt('/', { ...defaultConfig, pledgeFormUrl: 'https://forms.gle/example' });

    const pledgeLinks = screen.getAllByRole('link', { name: /príspevok|prispej/i });
    expect(pledgeLinks.filter((link) => link.getAttribute('href') === 'https://forms.gle/example')).toHaveLength(4);
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
        eventStartAt: preEventState.eventStartAt,
        liveTrackUrl: null,
        phase: 'live',
        result: null,
        updatedAt: null,
      } satisfies EventState,
      'práve beží',
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
        updatedAt: null,
      } satisfies EventState,
      'fáza behu sa skončila',
    ],
  ] as const)('renders honest %s phase status', (runtimeState, status) => {
    const { container } = renderAt('/', defaultConfig, emptyPledges, runtimeState);

    expect(screen.getByText(status)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'bež so mnou. zachráňme Vilyho.' }),
    ).toBeInTheDocument();
    expect(container).not.toHaveTextContent(/aktuálna poloha|prejdené km|vyzbierané spolu/i);
  });

  it('links directly to Garmin while live and keeps the pledge available', () => {
    renderAt(
      '/',
      { pledgeFormUrl: 'https://forms.gle/example' },
      emptyPledges,
      {
        ...preEventState,
        liveTrackUrl: 'https://livetrack.garmin.com/session/example',
        phase: 'live',
      },
    );
    expect(screen.getByRole('link', { name: /sledovať Maja naživo/i })).toHaveAttribute(
      'href',
      'https://livetrack.garmin.com/session/example',
    );
    expect(screen.getAllByRole('link', { name: /príspevok|prispej/i }).length).toBeGreaterThan(0);
  });

  it('renders the official post result and removes pledge CTAs', () => {
    renderAt(
      '/',
      { pledgeFormUrl: 'https://forms.gle/example' },
      emptyPledges,
      {
        ...preEventState,
        phase: 'post',
        result: {
          elapsedSeconds: 58 * 3600,
          finalDonationTotalEur: 12500,
          multiplier: 2.5,
          resultCopy: 'Schválený výsledkový text.',
          status: 'finished',
        },
      },
    );
    expect(screen.getByRole('heading', { name: 'Majo dobehol.' })).toBeInTheDocument();
    expect(screen.getByText('58 h 0 min 0 s')).toBeInTheDocument();
    expect(screen.getByText('2,5×')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /prispej na liečbu/i })).not.toBeInTheDocument();
  });

  it('renders the remaining homepage sections in the specified editorial order', () => {
    const { container } = renderAt('/');

    expect(
      Array.from(container.querySelectorAll('main > section[id]')).map((section) => section.id),
    ).toEqual(['vily', 'trasa', 'pribeh', 'tim', 'partneri', 'kontakt']);
    expect(screen.getByRole('heading', { name: '347,32 km krížom cez Slovensko.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Majov príbeh.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tím za behom.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Kto stojí pri projekte.' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Ozvite sa správnym smerom.' })).toBeInTheDocument();
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

  it('uses source-provided content while keeping genuinely missing inputs explicit', () => {
    const { container } = renderAt('/');
    const hero = screen.getByRole('region', { name: '347 km sólo pre Zachráňme Vilyho' });

    expect(within(hero).getByRole('img', { name: 'Majo s vlajkou Slovenska po pretekoch' }))
      .toHaveAttribute('src', '/majo.jpg');
    expect(within(hero).getByText('Tyršovo nábrežie')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Michal Šula' })).toBeInTheDocument();
    expect(screen.getByText('Majster Slovenska v ultrabehu.')).toBeInTheDocument();
    expect(screen.getByText('„Nie, ale môžeš byť prvý. A bude to trápenie.“')).toBeInTheDocument();
    expect(container).not.toHaveTextContent('dočasný citát zo zdrojového briefu');
    expect(screen.getByRole('heading', { name: 'IontMax' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Logo IontMax' })).toHaveAttribute(
      'src',
      '/iontmax.png',
    );
    expect(screen.getByRole('link', { name: 'iontmax.com →' })).toHaveAttribute(
      'href',
      'https://www.iontmax.com/',
    );
    expect(container).not.toHaveTextContent('Shokz');
    expect(container.querySelectorAll('[data-content-status="missing"].content-image').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'prečítaj celý rozhovor →' })).toHaveAttribute(
      'href',
      'https://refresher.sk/205038-23-rocny-Majo-kedysi-behal-len-pre-pivo-teraz-sa-chysta-zdolat-345-km-v-behu-Od-Tatier-k-Dunaju-Rozhovor',
    );
  });

  it('renders supplied contacts as valid links without adding unavailable routes', () => {
    renderAt('/');

    expect(screen.getByRole('link', { name: 'partneri@majootkd.sk' })).toHaveAttribute(
      'href',
      'mailto:partneri@majootkd.sk',
    );
    expect(screen.getByRole('link', { name: 'media@majootkd.sk' })).toHaveAttribute(
      'href',
      'mailto:media@majootkd.sk',
    );
    expect(screen.getAllByRole('link', { name: '@majo.crnkovic' })[0]).toHaveAttribute(
      'href',
      'https://www.instagram.com/majo.crnkovic/',
    );
    expect(screen.getByRole('link', { name: 'press kit →' })).toHaveAttribute('href', '/press');
  });

  it.each([
    ['/prispevky', 'Zoznam príspevkov.'],
    ['/dakujem', 'Ďakujeme, že bežíš s nami.'],
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

  it('renders consented and anonymous pledges with cent-safe totals', () => {
    renderAt('/prispevky', defaultConfig, {
      updatedAt: '2026-08-02T12:30:00+02:00',
      pledges: [
        { displayName: 'Jana N.', baseAmountEur: 0.01 },
        { displayName: null, baseAmountEur: 12.34 },
      ],
    });

    const table = screen.getByRole('table', { name: 'Verejné príspevky pre Zachráňme Vilyho' });
    expect(within(table).getByText('Jana N.')).toBeInTheDocument();
    expect(within(table).getByText('Anonym')).toBeInTheDocument();
    expect(within(table).getByText('SPOLU (2 ľudí)')).toBeInTheDocument();
    expect(within(table).getByText('12,35 €')).toBeInTheDocument();
    expect(within(table).getByText('30,88 €')).toBeInTheDocument();
  });

  it('copies the homepage share link from the thank-you page', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    renderAt('/dakujem');
    fireEvent.click(screen.getByRole('button', { name: 'kopírovať odkaz' }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('http://localhost:3000/'));
    expect(screen.getByText('Odkaz je skopírovaný.')).toBeInTheDocument();
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
