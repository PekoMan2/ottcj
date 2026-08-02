import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StickerButton } from './StickerButton';

describe('StickerButton', () => {
  it('uses safe button semantics by default', () => {
    render(<StickerButton>prisľúbiť</StickerButton>);

    expect(screen.getByRole('button', { name: 'prisľúbiť' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('preserves native disabled behavior', () => {
    render(<StickerButton disabled>pripravujeme</StickerButton>);

    expect(
      screen.getByRole('button', { name: 'pripravujeme' }),
    ).toBeDisabled();
  });
});
