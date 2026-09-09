import { access, readFile } from 'node:fs/promises';

const required = ['index.html', 'product.html', 'styles.css', 'app.js', 'data.js', 'assets/hero-waterproofing.webp', 'assets/roof-before.webp', 'assets/roof-after.webp'];
for (const file of required) await access(file);
const files = await Promise.all(['index.html', 'product.html', 'app.js'].map(file => readFile(file)));
const joined = files.map(x => x.toString()).join('\n');
if (/TODO|lorem ipsum|href=["']#["']/.test(joined)) throw new Error('Unfinished placeholder detected');
if (!joined.includes('aria-modal="true"')) throw new Error('Accessible modal markup missing');
console.log('Static checks passed.');
