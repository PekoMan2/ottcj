import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import App from './App';
import type { SiteConfig } from './config/site';

const defaultConfig: SiteConfig = {
  eventStartAt: '2026-08-13T06:00:00+02:00',
  phase: 'pre',
};

function renderAt(path: string, config: SiteConfig = defaultConfig) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App config={config} />
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
    expect(screen.getByText('36')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /prisľúbiť podporu — formulár pripravujeme/i })[0],
    ).toBeDisabled();
    expect(container.querySelector('[data-site-phase="pre"]')).not.toBeNull();
    expect(container.querySelector('[data-pledge-status="pending"]')).toHaveTextContent(
      'Počty a sumy doplníme z bezpečných verejných dát',
    );
  });

  it('opens the configured pledge form from every primary CTA', () => {
    renderAt('/', { ...defaultConfig, pledgeFormUrl: 'https://forms.gle/example' });

    const pledgeLinks = screen.getAllByRole('link', { name: /prísľub|prisľúbiť podporu/i });
    expect(pledgeLinks.filter((link) => link.getAttribute('href') === 'https://forms.gle/example')).toHaveLength(3);
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
    ['live', 'práve beží'],
    ['post', 'fáza behu sa skončila'],
  ] as const)('renders honest %s phase status without fabricated metrics', (phase, status) => {
    const { container } = renderAt('/', { ...defaultConfig, phase });

    expect(screen.getByText(status)).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'bež so mnou. zachráňme Vilyho.' }),
    ).toBeInTheDocument();
    expect(container).not.toHaveTextContent(/tempo|aktuálna poloha|dobehol som|vyzbierané spolu/i);
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
