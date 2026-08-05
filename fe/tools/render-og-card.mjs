// Renders the social link-preview card (public/og-card.png, 1200x630) from the
// site's own assets and fonts so the card stays in sync with the live brand.
// Run from fe/: node tools/render-og-card.mjs [outPath]

import { readFile, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import JSZip from 'jszip';

const WIDTH = 1200;
const HEIGHT = 630;

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = join(here, '..', 'public');
const outPath = process.argv[2] ?? join(publicDir, 'og-card.png');

const asset = (name) => pathToFileURL(join(publicDir, name)).href;

// Drawn-map positions of the real start and finish, hand-calibrated against
// mapatrans.png (548x488). The official track is projected between them.
const START_XY = [262, 171];
const FINISH_XY = [88, 339];

async function loadRoutePath() {
  const kmz = await readFile(
    join(publicDir, 'routes', 'MAJO_Od_Tatier_k_Dunaju_2026.kmz'),
  );
  const zip = await JSZip.loadAsync(kmz);
  const kmlName = Object.keys(zip.files).find((name) => name.endsWith('.kml'));
  const kml = await zip.files[kmlName].async('string');
  const blocks = [...kml.matchAll(/<coordinates>([\s\S]*?)<\/coordinates>/g)]
    .map((match) => match[1].trim().split(/\s+/))
    .sort((a, b) => b.length - a.length);
  const points = blocks[0].map((triple) => {
    const [lon, lat] = triple.split(',').map(Number);
    return [lon, lat];
  });

  const [startLon, startLat] = points[0];
  const [finishLon, finishLat] = points[points.length - 1];
  const scaleX = (START_XY[0] - FINISH_XY[0]) / (startLon - finishLon);
  const offsetX = START_XY[0] - scaleX * startLon;
  const scaleY = (START_XY[1] - FINISH_XY[1]) / (startLat - finishLat);
  const offsetY = START_XY[1] - scaleY * startLat;

  const step = Math.max(1, Math.floor(points.length / 70));
  const sampled = points.filter((_, index) => index % step === 0);
  sampled.push(points[points.length - 1]);
  return sampled
    .map(([lon, lat], index) => {
      const x = (scaleX * lon + offsetX).toFixed(1);
      const y = (scaleY * lat + offsetY).toFixed(1);
      return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
    })
    .join('');
}

const routePath = await loadRoutePath();

const INK = '#0f1419';
const PAPER = '#fdfcf9';
const EMBER = '#e8622d';
const ASH = '#6b6b6b';

const html = `<!doctype html>
<html lang="sk">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=JetBrains+Mono:wght@500&family=Prompt:ital,wght@1,200;1,300;1,800;1,900&display=swap"
  rel="stylesheet"
/>
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    position: relative;
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    overflow: hidden;
    background: ${PAPER};
    color: ${INK};
    font-family: 'Prompt', sans-serif;
    font-style: italic;
  }
  .dots {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle at 20% 30%, rgb(15 20 25 / 4%) 0 1.4px, transparent 1.7px);
    background-size: 22px 22px;
  }
  .frame {
    position: absolute;
    inset: 16px;
    border: 6px double ${INK};
    pointer-events: none;
  }
  .badge {
    position: absolute;
    top: 58px;
    left: 66px;
    border: 3px solid ${INK};
    background: ${EMBER};
    box-shadow: 4px 4px 0 ${INK};
    font-size: 21px;
    font-weight: 800;
    padding: 7px 16px;
    transform: rotate(-2deg);
  }
  .title {
    position: absolute;
    top: 128px;
    left: 66px;
    font-size: 86px;
    font-weight: 900;
    letter-spacing: -0.045em;
    line-height: 0.95;
  }
  .title span {
    display: block;
    color: ${EMBER};
    font-weight: 300;
    text-decoration: underline wavy ${EMBER} 3px;
    text-underline-offset: 12px;
  }
  .stats {
    position: absolute;
    top: 348px;
    left: 66px;
    display: flex;
    gap: 22px;
  }
  .stat {
    border: 3px solid ${INK};
    background: ${PAPER};
    box-shadow: 4px 4px 0 rgb(15 20 25 / 20%);
    padding: 10px 18px 8px;
    text-align: left;
  }
  .stat strong {
    display: block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 40px;
    font-style: normal;
    font-weight: 500;
    letter-spacing: -0.04em;
    line-height: 1;
  }
  .stat small {
    color: ${ASH};
    font-size: 15px;
    font-weight: 600;
  }
  .stat:nth-child(1) { transform: rotate(-1.2deg); }
  .stat:nth-child(2) { transform: rotate(0.8deg); }
  .stat:nth-child(3) { transform: rotate(-0.6deg); }
  .cta {
    position: absolute;
    top: 472px;
    left: 66px;
    border: 3px solid ${INK};
    background: ${EMBER};
    box-shadow: 6px 6px 0 ${INK};
    font-size: 34px;
    font-weight: 800;
    padding: 14px 30px;
    transform: rotate(-1deg);
  }
  .cta-note {
    position: absolute;
    top: 560px;
    left: 70px;
    color: ${ASH};
    font-family: 'Caveat', cursive;
    font-size: 27px;
    font-style: normal;
    font-weight: 700;
    transform: rotate(-1deg);
  }
  .map {
    position: absolute;
    top: 128px;
    right: 52px;
    width: 430px;
    transform: rotate(-2deg);
  }
  .map img { display: block; width: 100%; height: auto; }
  .map svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .map-label {
    position: absolute;
    border-radius: 3px;
    background: rgb(253 252 249 / 90%);
    box-shadow: 2px 2px 0 rgb(15 20 25 / 20%);
    font-family: 'Caveat', cursive;
    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: 0.9;
    padding: 3px 9px 5px;
  }
  .map-label small {
    display: block;
    font-family: 'Prompt', sans-serif;
    font-size: 13px;
    font-style: italic;
    font-weight: 300;
  }
  .map-label--start { top: 19%; left: 52%; transform: rotate(-3deg); }
  .map-label--finish { top: 74%; left: 4%; transform: rotate(-5deg); }
  .majo {
    position: absolute;
    top: 44px;
    right: 96px;
    width: 118px;
    height: 152px;
    border: 4px solid #e51a1a;
    border-radius: 50%;
    box-shadow: 4px 4px 0 rgb(0 0 0 / 15%);
    object-fit: cover;
    transform: rotate(-5deg);
  }
  .majo-note {
    position: absolute;
    top: 74px;
    right: 224px;
    width: 190px;
    color: ${INK};
    font-family: 'Caveat', cursive;
    font-size: 27px;
    font-style: normal;
    font-weight: 700;
    line-height: 1;
    text-align: right;
    transform: rotate(-4deg);
  }
  .halusky {
    position: absolute;
    top: -12px;
    right: 486px;
    width: 122px;
    transform: rotate(-14deg);
  }
  .lynx {
    position: absolute;
    right: -34px;
    bottom: -34px;
    width: 265px;
    transform: rotate(-5deg);
  }
  .heart {
    position: absolute;
    top: 350px;
    right: 500px;
    width: 44px;
    transform: rotate(14deg);
  }
</style>
</head>
<body>
  <div class="dots"></div>

  <div class="map">
    <img src="${asset('mapatrans.png')}" alt="" />
    <svg viewBox="0 0 548 488" fill="none">
      <path d="${routePath}" stroke="${EMBER}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
      <path d="${routePath}" stroke="${PAPER}" stroke-width="2.5" stroke-dasharray="6 8" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="${START_XY[0]}" cy="${START_XY[1]}" r="11" fill="#e51a1a" stroke="${INK}" stroke-width="4" />
      <circle cx="${FINISH_XY[0]}" cy="${FINISH_XY[1]}" r="11" fill="${INK}" stroke="${INK}" stroke-width="4" />
    </svg>
    <span class="map-label map-label--start">štart<small>Jasná · 13. 8. · 8:00</small></span>
    <span class="map-label map-label--finish">cieľ<small>Tyršovo nábrežie</small></span>
  </div>

  <img class="halusky" src="${asset('halusky.png')}" alt="" />
  <img class="majo" src="${asset('majo.jpg')}" alt="" />
  <p class="majo-note">tento borec pobeží 347 km →</p>
  <svg class="heart" viewBox="0 0 40 36">
    <path d="M20 33C8 24 2 17 3 10 4 4 10 1 14 4c3 2 5 5 6 7 1-2 3-5 6-7 4-3 10 0 11 6 1 7-5 14-17 23Z" fill="${EMBER}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" />
  </svg>
  <img class="lynx" src="${asset('rysostrovid.png')}" alt="" />

  <div class="badge">13. – 16. augusta 2026 · naživo</div>
  <h1 class="title">bež so mnou.<span>zachráňme Vilyho.</span></h1>
  <div class="stats">
    <div class="stat"><strong>347</strong><small>kilometrov</small></div>
    <div class="stat"><strong>84 h</strong><small>časový limit</small></div>
    <div class="stat"><strong>1</strong><small>bežec · sólo</small></div>
  </div>
  <div class="cta">Prispej Vilkovi →</div>
  <p class="cta-note">každé euro ide na Vilkovu liečbu · donio.sk</p>

  <div class="frame"></div>
</body>
</html>`;

// The page must live on the file: scheme, otherwise Chromium refuses to load
// the file:// asset images from an about:blank document.
const templatePath = join(tmpdir(), `otkd-og-card-${process.pid}.html`);
await writeFile(templatePath, html, 'utf8');

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    deviceScaleFactor: 2,
    viewport: { height: HEIGHT, width: WIDTH },
  });
  await page.goto(pathToFileURL(templatePath).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images, (image) =>
        image.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true });
              image.addEventListener('error', resolve, { once: true });
            }),
      ),
    );
  });
  await page.screenshot({ path: outPath, scale: 'css' });
  console.log(`wrote ${outPath} (${WIDTH}x${HEIGHT})`);
} finally {
  await browser.close();
  await unlink(templatePath).catch(() => {});
}
