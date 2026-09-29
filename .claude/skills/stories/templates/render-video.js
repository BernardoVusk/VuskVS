// Renderiza stories.html em vídeo MP4 1080x1920 (um por .slide) + PNG do quadro final.
// A duração de cada story vem do atributo data-dur do .slide (segundos, padrão 6).
// Congela as animações CSS e avança o relógio quadro a quadro, então o vídeo sai liso
// independente da velocidade da máquina.
// Uso: node render-video.js          → todos os stories
//      node render-video.js 3 5      → só os stories 3 e 5
// Depende de playwright-core na raiz do workspace e do ffmpeg no PATH.

const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

function acharPlaywright() {
  let dir = __dirname;
  for (let i = 0; i < 6; i++) {
    const tent = path.join(dir, 'node_modules', 'playwright-core');
    if (fs.existsSync(tent)) return tent;
    dir = path.dirname(dir);
  }
  throw new Error('playwright-core não encontrado. Rode `npm install` na raiz do workspace.');
}
const { chromium } = require(acharPlaywright());

function acharChromium() {
  const base = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
  if (fs.existsSync(base)) {
    const dir = fs
      .readdirSync(base)
      .filter((d) => /^chromium-\d+$/.test(d))
      .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))[0];
    if (dir) return path.join(base, dir, 'chrome-win64', 'chrome.exe');
  }
  const instalados = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  const achado = instalados.find((p) => fs.existsSync(p));
  if (!achado) throw new Error('Nenhum navegador encontrado (ms-playwright, Chrome ou Edge)');
  return achado;
}

const FPS = 30;
const OUT = path.join(__dirname, 'stories');
const SO = process.argv.slice(2).map(Number).filter(Boolean);

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: acharChromium() });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const url = 'file:///' + path.join(__dirname, 'stories.html').replace(/\\/g, '/');

  await page.goto(url);
  const duracoes = await page.$$eval('.slide', (els) => els.map((e) => Number(e.dataset.dur) || 6));

  for (let s = 1; s <= duracoes.length; s++) {
    if (SO.length && !SO.includes(s)) continue;
    const n = String(s).padStart(2, '0');
    const frames = path.join(__dirname, '_frames', n);
    fs.rmSync(frames, { recursive: true, force: true });
    fs.mkdirSync(frames, { recursive: true });

    await page.goto(`${url}?s=${s}`);
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => document.getAnimations().forEach((a) => a.pause()));

    const total = duracoes[s - 1] * FPS;
    for (let f = 0; f < total; f++) {
      await page.evaluate((ms) => document.getAnimations().forEach((a) => { a.currentTime = ms; }), (f * 1000) / FPS);
      await page.screenshot({ path: path.join(frames, `f${String(f).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 95 });
    }
    // quadro final completo em PNG (serve de post estático e de prévia)
    await page.screenshot({ path: path.join(OUT, `story-${n}.png`) });

    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, 'f%04d.jpg'),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', path.join(OUT, `story-${n}.mp4`)]);
    fs.rmSync(frames, { recursive: true, force: true });
    console.log('ok', `story-${n}.mp4`, `(${duracoes[s - 1]}s)`);
  }
  fs.rmSync(path.join(__dirname, '_frames'), { recursive: true, force: true });
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
