import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Container } from '../../components/ui';
import { siteContent } from '../../config/content';
import { DonioCta } from '../donio/DonioCta';
import type { EventState } from '../event/eventState';
import { EventStatus } from './EventStatus';

export function SiteHeader({ eventState }: { eventState: EventState }) {
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
          <img
            alt=""
            className="brand__logo"
            height={144}
            src="/otkd-logo.png"
            width={700}
          />
        </Link>

        <nav aria-label="Hlavná navigácia" className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`} id="site-navigation">
          {siteContent.navigation.header.map((item) => (
            <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <EventStatus eventState={eventState} />
          {eventState.phase !== 'post' ? <DonioCta size="compact" /> : null}
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
