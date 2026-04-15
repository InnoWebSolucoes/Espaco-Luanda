import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/rafam/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';
const dir   = path.join(__dirname, 'temporary screenshots');

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// auto-increment
let n = 1;
while (fs.existsSync(path.join(dir, `screenshot-${n}${label}.png`))) n++;
const outFile = path.join(dir, `screenshot-${n}${label}.png`);

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:/Users/rafam/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
const page    = await browser.newPage();
await page.setViewport({ width: 1440, height: 860 });
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 0 });
// wait for fonts/styles to paint
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: outFile, fullPage: false });
await browser.close();

console.log(`Saved: ${outFile}`);
