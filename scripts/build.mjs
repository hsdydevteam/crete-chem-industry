import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { build } from 'esbuild';

const root = process.cwd();
const out = join(root, 'dist');
if(out!==join(process.cwd(),'dist'))throw new Error('Invalid build target');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const entry of ['index.html', 'product.html', 'admin.html', 'styles.css', 'theme.css', 'cart.css', 'app.js', 'cart.js', 'admin.js', 'data.js', 'robots.txt', 'sitemap.xml', 'assets']) {
  await cp(join(root, entry), join(out, entry), { recursive: true });
}
if (!process.argv.includes('--vercel')) {
await mkdir(join(out,'client'),{recursive:true});
for(const entry of ['index.html','product.html','admin.html','styles.css','theme.css','cart.css','app.js','cart.js','admin.js','data.js','robots.txt','sitemap.xml','assets'])await cp(join(root,entry),join(out,'client',entry),{recursive:true});
await build({entryPoints:['server/worker.js'],bundle:true,format:'esm',platform:'browser',target:'es2022',outfile:'dist/server/index.js'});
await mkdir(join(out,'.openai'),{recursive:true});
await cp('.openai/hosting.json',join(out,'.openai/hosting.json'));
}
console.log('Built storefront and order API in dist/');
