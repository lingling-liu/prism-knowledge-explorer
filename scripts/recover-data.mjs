import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root = path.resolve(import.meta.dirname, '..');
const resources = vm.runInNewContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8') + '\nPRISM_DATA');
fs.mkdirSync(path.join(root, 'data'), {recursive:true});
fs.writeFileSync(path.join(root, 'data/resources.json'), JSON.stringify(resources, null, 2) + '\n', 'utf8');
console.log(`Recovered all ${resources.length} original records without changing fields.`);
