import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import type { SiteConfig } from '../../config/site';
import { Container } from '../../components/ui';
import { EventStatus } from './EventStatus';
import { PledgeCta } from './PledgeCta';

const navigation = [
  { href: '/#trasa', label: 'trasa' },
  { href: '/#vily', label: 'Vily' },
  { href: '/#tim', label: 'tím' },
  { href: '/#partneri', label: 'partneri' },
  { href: '/#prislub', label: 'prísľub' },
] as const;

interface SiteHeaderProps {
  config: SiteConfig;
}

export function SiteHeader({ config }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header" data-scrolled={scrolled || undefined}>
      <Container className="site-header__inner">
        <Link aria-label="Majo · Od Tatier k Dunaju — domov" className="brand" to="/">
          <span className="brand__uuu">uuu</span>
          <span className="brand__name">MAJO · OTKD</span>
        </Link>

        <nav aria-label="Hlavná navigácia" className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`} id="site-navigation">
          {navigation.map((item) => (
            <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <EventStatus eventStartAt={config.eventStartAt} phase={config.phase} />
          <PledgeCta compact href={config.pledgeFormUrl} />
          <button
            aria-controls="site-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Zavrieť navigáciu' : 'Otvoriť navigáciu'}
            className="menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            ref={menuButtonRef}
            type="button"
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </Container>
    </header>
  );
}
