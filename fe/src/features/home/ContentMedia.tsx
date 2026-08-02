import type { ContentImage, ContentLink } from '../../config/content';

interface ContentImageViewProps {
  className?: string;
  image: ContentImage;
}

export function ContentImageView({ className, image }: ContentImageViewProps) {
  const classes = ['content-image', className].filter(Boolean).join(' ');

  if (image.status === 'ready') {
    return (
      <img
        alt={image.alt}
        className={classes}
        decoding="async"
        height={image.height}
        loading="lazy"
        src={image.src}
        width={image.width}
      />
    );
  }

  return (
    <div className={`${classes} content-image--missing`} data-content-status="missing">
      <strong>{image.label}</strong>
      <span>{image.note}</span>
    </div>
  );
}

interface ContentLinkViewProps {
  className?: string;
  link: ContentLink;
}

export function ContentLinkView({ className, link }: ContentLinkViewProps) {
  if (link.status === 'ready') {
    return (
      <a className={className} data-content-status="ready" href={link.href}>
        {link.label}
      </a>
    );
  }

  return (
    <span
      aria-disabled="true"
      className={className}
      data-content-status="missing"
      title={link.note}
    >
      {link.label}
      <small>{link.note}</small>
    </span>
  );
}
