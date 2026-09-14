import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const resources = JSON.parse(fs.readFileSync(path.join(root, 'data', 'resources.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const missingAssets = resources.filter(item => !item.thumbnail || !fs.existsSync(path.join(root, item.thumbnail)));
const malformedLinks = resources.filter(item => item.name && !/^https?:\/\//i.test(item.link));
const encodingErrors = resources.filter(item => /\uFFFD|\u00E2[\u0080-\u00BF]/u.test(JSON.stringify(item)));
const absoluteLocalPaths = /(?:C:\\|file:\/\/|127\.0\.0\.1|localhost|chatgpt\.site)/i.test(html + app + JSON.stringify(resources));
const target = resources.find(item => item.name === 'Why does addressing land-based pollution matter?');

const checks = {
  resources: resources.length,
  missingAssets: missingAssets.length,
  malformedLinks: malformedLinks.length,
  encodingErrors: encodingErrors.length,
  absoluteLocalPaths,
  clickableThumbnails: app.includes('<a class="card-image"'),
  tagsBeforeThumbnail: app.includes('<article class="resource-card"><div class="card-meta"'),
  unepThumbnail: target?.thumbnail === 'thumbnails/unep-land-based-pollution.jpg',
  utf8: html.includes('<meta charset="utf-8">')
};

console.log(JSON.stringify(checks, null, 2));
if (malformedLinks.length) console.warn(`Warning: ${malformedLinks.length} source records do not contain valid absolute web links; see README.md.`);
if (missingAssets.length || encodingErrors.length || absoluteLocalPaths || !checks.clickableThumbnails || !checks.tagsBeforeThumbnail || !checks.unepThumbnail || !checks.utf8) process.exit(1);
