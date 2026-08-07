const environment = import.meta.env as {
  VITE_DONIO_URL?: string;
  VITE_NOTIFY_FORM_URL?: string;
  VITE_OFFICIAL_TRACKING_URL?: string;
};

function link(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export const siteLinks = Object.freeze({
  donio: link(
    environment.VITE_DONIO_URL,
    'https://donio.sk/zachranme-vilyho/majo-od-tatier-k-dunaju',
  ),
  notifyForm: link(
    environment.VITE_NOTIFY_FORM_URL,
    'https://docs.google.com/forms/d/e/1FAIpQLSegRzumYZgOYlFeqTv3LtHKBqYCAIrzDHKDBrFOXDu5JQi2yA/viewform',
  ),
  officialTracking: link(
    environment.VITE_OFFICIAL_TRACKING_URL,
    'https://sunbell.tracktherace.com/sk/sportove-udalosti/beh-v-prirode/od-tatier-k-dunaju-2026-solo/pretek',
  ),
});
