import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, '_site');
const resourcesPath = path.join(root, 'data', 'resources.json');
const resources = JSON.parse(fs.readFileSync(resourcesPath, 'utf8'));

fs.writeFileSync(path.join(root, 'data.js'), `const PRISM_DATA = ${JSON.stringify(resources)};\n`, 'utf8');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const file of ['index.html', 'styles.css', 'card-overrides.css', 'app.js', 'data.js']) {
  fs.copyFileSync(path.join(root, file), path.join(out, file));
}
fs.cpSync(path.join(root, 'thumbnails'), path.join(out, 'thumbnails'), { recursive: true });
fs.writeFileSync(path.join(out, '.nojekyll'), '', 'utf8');
console.log(`Built ${resources.length} resources in ${out}`);
