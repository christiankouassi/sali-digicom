import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist-digicom');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(INDEX_HTML_PATH)) {
  console.error('Error: dist-digicom/index.html not found! Run "vite build --mode digicom" first.');
  process.exit(1);
}

let html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

const route = {
  title: 'SALI DigiCom | Agence de Marketing & Communication Digitale',
  desc: 'Agence de marketing et communication digitale. Conception & Développement web, Design UX/UI, solutions numériques sur mesure et performance au Maroc.',
  favicon: 'https://www.sali-digicom.com/logo-digicom.png',
  ogImage: 'https://www.sali-digicom.com/logo-digicom-full.png',
  url: 'https://www.sali-digicom.com'
};

// Replace Title
html = html.replace(/<title>.*?<\/title>/gi, `<title>${route.title}</title>`);
html = html.replace(/<meta\s+name="title"\s+content=".*?"\s*\/?>/gi, `<meta name="title" content="${route.title}" />`);
html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${route.title}" />`);
html = html.replace(/<meta\s+property="twitter:title"\s+content=".*?"\s*\/?>/gi, `<meta property="twitter:title" content="${route.title}" />`);

// Replace Description
html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${route.desc}" />`);
html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${route.desc}" />`);
html = html.replace(/<meta\s+property="twitter:description"\s+content=".*?"\s*\/?>/gi, `<meta property="twitter:description" content="${route.desc}" />`);

// Replace OG / Twitter URL
html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:url" content="${route.url}" />`);
html = html.replace(/<meta\s+property="twitter:url"\s+content=".*?"\s*\/?>/gi, `<meta property="twitter:url" content="${route.url}" />`);

// Replace OG / Twitter Image
html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image" content="${route.ogImage}" />`);
html = html.replace(/<meta\s+property="twitter:image"\s+content=".*?"\s*\/?>/gi, `<meta property="twitter:image" content="${route.ogImage}" />`);

// Replace Icon / Favicon
html = html.replace(/<link\s+rel="icon"\s+[^>]*?href=".*?"\s*\/?>/gi, `<link rel="icon" type="image/png" href="${route.favicon}" />`);
html = html.replace(/<link\s+rel="apple-touch-icon"\s+[^>]*?href=".*?"\s*\/?>/gi, `<link rel="apple-touch-icon" href="${route.favicon}" />`);

fs.writeFileSync(INDEX_HTML_PATH, html, 'utf8');
console.log('Successfully replaced metadata in dist-digicom/index.html with SALI DigiCom branding!');
