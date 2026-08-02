import type { ButtonHTMLAttributes } from 'react';

export interface StickerButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'regular' | 'small';
  variant?: 'primary' | 'dark';
}

export function StickerButton({
  className,
  size = 'regular',
  type = 'button',
  variant = 'primary',
  ...props
}: StickerButtonProps) {
  const classes = [
    'sticker-button',
    variant === 'dark' ? 'sticker-button--dark' : undefined,
    size === 'small' ? 'sticker-button--small' : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} type={type} {...props} />;
}
