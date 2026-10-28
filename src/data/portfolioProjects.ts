export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: 'web' | 'brand' | 'community';
  categoryLabel: string;
  year: string;
  city: string;
  liveUrl?: string;
  tags: string[];
  excerpt: string;
  aboutClient: string;
  ourIntervention: string;
  primaryImage: string;
  secondaryImage: string;
  detailImage: string;
  mobileImage?: string;
  whiteLogo: string;
  gallery: Array<{ src: string; caption: string; type?: 'desktop' | 'mobile' | 'branding' | 'poster' }>;
  deliverables: string[];
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'cap-investment',
    slug: 'cap-investment-solutions',
    title: 'CAP Investment Solutions',
    client: 'CAP Group UAE',
    category: 'web',
    categoryLabel: 'Plateforme Web & FinTech',
    year: '2025 - 2026',
    city: 'Casablanca & Dubaï',
    liveUrl: 'https://capgroupuae.com/',
    tags: ['Site Institutionnel', 'FinTech & Conseil', 'Design System', 'Performance'],
    excerpt: 'Conception et développement sur mesure de la plateforme institutionnelle de CAP Investment Solutions.',
    aboutClient: 'CAP Investment Solutions est un cabinet de conseil financier et d’investissement stratégique basé aux Émirats Arabes Unis et au Maroc, accompagnant investisseurs institutionnels et entrepreneurs de premier plan.',
    ourIntervention: 'SALI DigiCom a conçu une expérience digitale de prestige : architecture de l’information rigoureuse, parcours utilisateur orienté conversion institutionnelle, intégration frontend ultra-fluide et score de performance optimal.',
    primaryImage: '/portfolio/websites/cap-hero-desktop.jpg',
    secondaryImage: '/portfolio/websites/cap-section-desktop.jpg',
    detailImage: '/portfolio/websites/cap-detail-desktop.jpg',
    mobileImage: '/portfolio/websites/cap-mobile.jpg',
    whiteLogo: '/portfolio/logos/cap-white.png',
    gallery: [
      { src: '/portfolio/websites/cap-hero-desktop.jpg', caption: 'Écran d’accueil immersif avec typographie statutaire', type: 'desktop' },
      { src: '/portfolio/websites/cap-section-desktop.jpg', caption: 'Sections métiers & grille d’expertise financière', type: 'desktop' },
      { src: '/portfolio/websites/cap-detail-desktop.jpg', caption: 'Composants interactifs & points de contact qualifiés', type: 'desktop' },
      { src: '/portfolio/websites/cap-mobile.jpg', caption: 'Adaptation mobile réactive sans compromis visuel', type: 'mobile' },
    ],
    deliverables: ['Direction Artistique', 'UI/UX Design', 'Développement Web Haute Performance', 'Responsive Mobile & Tablette']
  },
  {
    id: 'gueliz-properties',
    slug: 'gueliz-properties',
    title: 'Gueliz Properties',
    client: 'SD Gestion',
    category: 'web',
    categoryLabel: 'Plateforme Immobilière & Identité',
    year: '2025',
    city: 'Marrakech',
    tags: ['Conciergerie Haut Standing', 'Gestion Locative', 'Identité de Marque', 'UI/UX'],
    excerpt: 'Création de l’identité de marque et de la plateforme web de conciergerie et gestion locative de prestige à Marrakech.',
    aboutClient: 'Gueliz Properties (SD Gestion) propose des services sur mesure de conciergerie d’excellence, de design d’intérieur et de valorisation patrimoniale d’appartements et villas de luxe à Marrakech.',
    ourIntervention: 'Création globale de la marque par SALI DigiCom : monogramme GP calligraphique, charte graphique raffinée (ivoire doux, noyer profond et vert sauge), et développement d’une vitrine immobilière ergonomique et élégante.',
    primaryImage: '/portfolio/websites/gueliz-hero-desktop.jpg',
    secondaryImage: '/portfolio/websites/gueliz-section-desktop.jpg',
    detailImage: '/portfolio/websites/gueliz-detail-desktop.jpg',
    mobileImage: '/portfolio/websites/gueliz-mobile.jpg',
    whiteLogo: '/portfolio/logos/gueliz-white.png',
    gallery: [
      { src: '/portfolio/websites/gueliz-hero-desktop.jpg', caption: 'Hero screen épuré mettant en valeur les résidences d’exception', type: 'desktop' },
      { src: '/portfolio/branding/gueliz-charte-logos.jpg', caption: 'Système identitaire officiel et déclinaisons typographiques', type: 'branding' },
      { src: '/portfolio/websites/gueliz-section-desktop.jpg', caption: 'Présentation des services conciergerie et gestion locative', type: 'desktop' },
      { src: '/portfolio/websites/gueliz-detail-desktop.jpg', caption: 'Formulaires de réservation et détails des prestations', type: 'desktop' },
      { src: '/portfolio/branding/gueliz-charte-palette.jpg', caption: 'Palette chromatique minérale et typographie Cormorant Garamond', type: 'branding' },
      { src: '/portfolio/websites/gueliz-mobile.jpg', caption: 'Navigation mobile optimisée pour les voyageurs et propriétaires', type: 'mobile' },
    ],
    deliverables: ['Logotype & Charte Graphique Complète', 'Plateforme Web Responsive', 'Photographies d’Intérieur', 'Supports Commerciaux']
  },
  {
    id: 'imtiaz-taamine',
    slug: 'imtiaz-taamine',
    title: 'Imtiaz Taamine',
    client: 'Cabinet Imtiaz Taamine',
    category: 'web',
    categoryLabel: 'Site Métier & Acquisition Digitale',
    year: '2025',
    city: 'Marrakech',
    liveUrl: 'https://imtiaztaamine.ma',
    tags: ['Courtage d’Assurances', 'Génération de Leads', 'Optimisation SEO', 'UX Orientée Devis'],
    excerpt: 'Digitalisation des offres de courtage en assurances et mise en place d’un tunnel d’acquisition de prospects qualifiés.',
    aboutClient: 'Imtiaz Taamine est un cabinet de courtage en assurances réputé au Maroc, apportant des solutions de couverture santé, automobile, habitation et professionnelle adaptées à chaque client.',
    ourIntervention: 'Refonte digitale complète par SALI DigiCom : simplification des offres complexes, modules interactifs de simulation de devis, optimisation SEO locale et nationale, et intégration des canaux de contact instantané.',
    primaryImage: '/portfolio/websites/imtiaz-hero-desktop.jpg',
    secondaryImage: '/portfolio/websites/imtiaz-section-desktop.jpg',
    detailImage: '/portfolio/websites/imtiaz-detail-desktop.jpg',
    mobileImage: '/portfolio/websites/imtiaz-mobile.jpg',
    whiteLogo: '/portfolio/logos/imtiaz-white.png',
    gallery: [
      { src: '/portfolio/websites/imtiaz-hero-desktop.jpg', caption: 'Portail d’accueil centré sur la clarté des garanties d’assurance', type: 'desktop' },
      { src: '/portfolio/websites/imtiaz-section-desktop.jpg', caption: 'Catalogue des garanties santé, prévoyance et automobile', type: 'desktop' },
      { src: '/portfolio/websites/imtiaz-detail-desktop.jpg', caption: 'Formulaire de devis express interconnecté', type: 'desktop' },
      { src: '/portfolio/websites/imtiaz-mobile.jpg', caption: 'Interface mobile pensée pour le contact d’urgence et WhatsApp', type: 'mobile' },
    ],
    deliverables: ['Architecture Web', 'Tunnel de Devis en Ligne', 'Référencement Naturel Google (SEO)', 'Suivi Analytique & Conversion']
  },
  {
    id: 'axeon-media',
    slug: 'axeon-media',
    title: 'Axeon Media',
    client: 'Axeon',
    category: 'community',
    categoryLabel: 'Community Management & Social Media',
    year: '2025 - 2026',
    city: 'Casablanca',
    tags: ['Social Media', 'Campagnes Sponsorisées', 'Direction Artistique', 'Reels & Carrousels'],
    excerpt: 'Stratégie de contenus, direction artistique des publications et animation continue de l’écosystème social media.',
    aboutClient: 'Axeon est un acteur dynamique opérant dans l’événementiel, la communication et les expériences de marque au Maroc.',
    ourIntervention: 'Gestion éditoriale et graphique assurée par SALI DigiCom : calendrier de publication stratégique, création d’affiches et de carrousels percutants, direction artistique sur-mesure et optimisation des campagnes publicitaires sponsorisées.',
    primaryImage: '/portfolio/axeon/axeon-campagne-01.jpg',
    secondaryImage: '/portfolio/axeon/axeon-post-01.jpg',
    detailImage: '/portfolio/axeon/axeon-post-02.jpg',
    whiteLogo: '/portfolio/logos/axeon-white.png',
    gallery: [
      { src: '/portfolio/axeon/axeon-campagne-01.jpg', caption: 'Campagne de lancement événementiel — format poster haute visibilité', type: 'poster' },
      { src: '/portfolio/axeon/axeon-post-01.jpg', caption: 'Publication thématique avec composition typographique percutante', type: 'poster' },
      { src: '/portfolio/axeon/axeon-post-02.jpg', caption: 'Mise en avant des formats visuels dynamiques pour Instagram et LinkedIn', type: 'poster' },
      { src: '/portfolio/axeon/axeon-post-03.jpg', caption: 'Valorisation des temps forts de la marque et engagement communautaire', type: 'poster' },
      { src: '/portfolio/axeon/axeon-alma-resort.jpg', caption: 'Direction visuelle Alma Resort — mise en valeur d’espaces exclusifs', type: 'poster' },
      { src: '/portfolio/axeon/axeon-carousel-01.jpg', caption: 'Structure de carrousel pédagogique et acquisition d’audience', type: 'poster' },
    ],
    deliverables: ['Stratégie de Contenu Éditoriale', 'Création Visuelle (Photos, Carrousels, Stories)', 'Publicité Ciblée Meta Ads', 'Rapports Mensuels d’Engagement']
  },
  {
    id: 'cap-assur',
    slug: 'cap-assur',
    title: "CAP'ASSUR",
    client: "CAP'ASSUR — Agent Général AXA Assurance Maroc",
    category: 'brand',
    categoryLabel: 'Identité Visuelle & Charte Graphique',
    year: '2025',
    city: 'Casablanca',
    tags: ['Logotype de Marque', 'Charte Graphique Officielle', 'Bannières Réseaux', 'Papeterie'],
    excerpt: 'Création du logotype officiel et déploiement du brand system complet de CAP’ASSUR, agent général AXA.',
    aboutClient: 'CAP’ASSUR représente l’excellence du conseil et de la proximité en assurance, sous mandat d’agent général AXA Assurance Maroc.',
    ourIntervention: 'SALI DigiCom a conçu le logotype statutaire CA, la charte graphique officielle (bleu royal, blanc immaculé et gris technique), ainsi que les bannières institutionnelles pour LinkedIn et Facebook.',
    primaryImage: '/portfolio/branding/capassur-banner-showcase.jpg',
    secondaryImage: '/portfolio/branding/capassur-charte-cover.jpg',
    detailImage: '/portfolio/branding/capassur-charte-logos.jpg',
    whiteLogo: '/portfolio/logos/capassur-white.png',
    gallery: [
      { src: '/portfolio/branding/capassur-banner-showcase.jpg', caption: 'Bannières corporate LinkedIn et Facebook déployées pour la marque', type: 'branding' },
      { src: '/portfolio/branding/capassur-charte-cover.jpg', caption: 'Couverture du Brand Book officiel CAP’ASSUR', type: 'branding' },
      { src: '/portfolio/branding/capassur-charte-logos.jpg', caption: 'Système des déclinaisons du logo, zone de sécurité et règles de contraste', type: 'branding' },
      { src: '/portfolio/branding/capassur-charte-palette.jpg', caption: 'Nuancier officiel Pantone, CMJN, RVB et hiérarchie typographique', type: 'branding' },
    ],
    deliverables: ['Logotype & Emblème Vectoriel', 'Brand Book & Guide des Normes', 'Bannières Réseaux Sociaux', 'Kits Papeterie Corporate']
  }
];

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return PORTFOLIO_PROJECTS.find(p => p.slug === slug || p.id === slug);
}

export function getNextProject(currentSlug: string): PortfolioProject {
  const index = PORTFOLIO_PROJECTS.findIndex(p => p.slug === currentSlug || p.id === currentSlug);
  if (index === -1) return PORTFOLIO_PROJECTS[0];
  return PORTFOLIO_PROJECTS[(index + 1) % PORTFOLIO_PROJECTS.length];
}
