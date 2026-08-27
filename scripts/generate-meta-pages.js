import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(INDEX_HTML_PATH)) {
  console.error('Error: dist/index.html not found! Run "vite build" first.');
  process.exit(1);
}

const originalHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

const routesConfig = [
  {
    name: 'salicommodities',
    title: 'SALI Commodities | Négoce & Agroalimentaire',
    desc: 'Société d’import-export, spécialisée dans l’agro-alimentaire ainsi que les matières premières.',
    favicon: 'https://i.postimg.cc/fbhrdVzD/5.png',
    ogImage: 'https://i.postimg.cc/fbhrdVzD/5.png',
    url: 'https://sali-capital.com/salicommodities'
  },
  {
    name: 'foncieredassouli',
    title: 'Foncière Dassouli | Investissement Immobilier Locatif',
    desc: 'Société immobilière, spécialisée dans l’investissement locatif en locaux commerciaux.',
    favicon: 'https://i.postimg.cc/SRm07fwV/Dassouli.png',
    ogImage: 'https://i.postimg.cc/SRm07fwV/Dassouli.png',
    url: 'https://sali-capital.com/foncieredassouli'
  },
  {
    name: 'salidigicom',
    title: 'SALI DigiCom | Agence de Marketing & Communication Digitale',
    desc: 'Agence de marketing et communication digitale.',
    favicon: 'https://sali-capital.com/favicon.png',
    ogImage: 'https://sali-capital.com/logo-digicom-full.png',
    url: 'https://www.sali-digicom.com'
  }
];

function generateRoutePage(route) {
  let html = originalHtml;

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

  // Create folder and save file
  const routeFolder = path.join(DIST_DIR, route.name);
  if (!fs.existsSync(routeFolder)) {
    fs.mkdirSync(routeFolder, { recursive: true });
  }
  
  fs.writeFileSync(path.join(routeFolder, 'index.html'), html, 'utf8');
  console.log(`Generated: dist/${route.name}/index.html with custom metadata.`);
}

console.log('Generating custom metadata pages for routes...');
routesConfig.forEach(generateRoutePage);
console.log('Static routing metadata generation complete!');
