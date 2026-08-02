import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import App from './App';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('App routes', () => {
  it('renders the pre-phase product foundation at the root route', () => {
    const { container } = renderAt('/');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Od Tatier k Dunaju.' }),
    ).toBeInTheDocument();
    expect(screen.getByText('pred behom')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'prisľúbiť podporu →' }),
    ).toBeDisabled();
    expect(container.querySelector('[data-site-phase="pre"]')).not.toBeNull();
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
