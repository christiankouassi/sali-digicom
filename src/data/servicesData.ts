export interface SubService {
  title: string;
  desc: string;
}

export interface BentoFeature {
  title: string;
  desc: string;
  metric?: string;
}

export interface ServiceDetail {
  slug: string;
  categoryNumber: string;
  title: string;
  tagline: string;
  heroExcerpt: string;
  overview: string;
  subServices: SubService[];
  bentoFeatures: BentoFeature[];
  deliverables: string[];
  heroImage: string;
  relatedProjectIds: string[];
}

export const SERVICES_CATALOG: Record<string, ServiceDetail> = {
  'web': {
    slug: 'web',
    categoryNumber: '01',
    title: 'Conception & Développement Web',
    tagline: 'Plateformes sur mesure, sites vitrines d’exception et architectures haute performance.',
    heroExcerpt: 'Nous combinons l’esprit de création artistique à la rigueur technique pour concevoir des expériences numériques remarquables, conçues pour sublimer votre marque et accélérer votre conversion.',
    overview: 'Chaque site conçu par SALI DigiCom est une pièce d’orfèvrerie numérique. Nous refusons les modèles préfabriqués et concevons des interfaces exclusives, optimisées au millimètre pour le référencement naturel, la fluidité des interactions et la sécurité de vos données.',
    subServices: [
      {
        title: 'Landing Page Haute Conversion',
        desc: 'Pages d’atterrissage taillées pour maximiser vos campagnes publicitaires et transformer vos visiteurs en clients qualifiés.'
      },
      {
        title: 'Site Vitrine & Architecture de Marque',
        desc: 'Présentation élégante, interactive et immersive de votre activité pour asseoir votre autorité sur votre marché.'
      },
      {
        title: 'Portail Corporate & Institutionnel',
        desc: 'Plateformes d’envergure pour holdings, groupes d’investissement et cabinets juridiques ou financiers internationaux.'
      },
      {
        title: 'Plateforme E-Commerce & Solutions Sur-Mesure',
        desc: 'Boutiques en ligne performantes avec tunnels d’achat optimisés, intégration des paiements sécurisés et gestion de stocks fluide.'
      },
      {
        title: 'Maintenance & Optimisation Continue',
        desc: 'Supervision technique proactive, mises à jour de sécurité, sauvegardes quotidiennes et audit permanent des performances.'
      }
    ],
    bentoFeatures: [
      {
        title: 'Vitesse de Chargement Exceptionnelle',
        desc: 'Optimisation stricte des Core Web Vitals pour un chargement sous la seconde sur mobile et desktop.',
        metric: '< 0.8s'
      },
      {
        title: 'Animation Cinétique & WebGL',
        desc: 'Interactions fluides et transitions cinétiques sans aucune saccade ni dégradation de la batterie.',
        metric: '60 FPS'
      },
      {
        title: 'Code Propriétaire & Évolutif',
        desc: 'Développement moderne (React, TypeScript, Tailwind) garantissant une scalabilité totale sans dépendance verrouillée.',
        metric: '100% Pur'
      }
    ],
    deliverables: [
      'Design System Figma complet & maquettes responsives',
      'Développement frontend & backend sur mesure',
      'Optimisation SEO technique & balisage Schema.org',
      'Tableau de bord de gestion de contenu simplifié',
      'Formation et documentation technique d’utilisation'
    ],
    heroImage: '/portfolio/websites/cap-hero-desktop.jpg',
    relatedProjectIds: ['cap-investment', 'gueliz-properties', 'imtiaz-taamine']
  },

  'branding': {
    slug: 'branding',
    categoryNumber: '02',
    title: 'Identité Visuelle & Branding',
    tagline: 'Logotypes statutaires, chartes graphiques complètes et univers de marque d’envergure.',
    heroExcerpt: 'Nous sculptons des identités visuelles intemporelles et puissantes qui s’imposent immédiatement dans l’esprit de vos clients et reflètent le niveau d’excellence de votre entreprise.',
    overview: 'L’identité de votre marque est son actif le plus précieux. Notre studio élabore des codes visuels précis, équilibrés et percutants, capables de traverser le temps tout en conservant leur force d’évocation sur l’ensemble des points de contact.',
    subServices: [
      {
        title: 'Création de Logotype Sur-Mesure',
        desc: 'Conception de logos exclusifs, mémorables et modulables, pensés pour fonctionner avec impact du digital au print.'
      },
      {
        title: 'Charte Graphique Complète & Guidelines',
        desc: 'Définition des codes typographiques, de la palette chromatique, des grilles de mise en page et des règles d’usage strictes.'
      },
      {
        title: 'Papeterie & Supports Institutionnels',
        desc: 'Cartes de visite de prestige, en-têtes de lettres, enveloppes et chemises à rabat avec finitions haut de gamme.'
      },
      {
        title: 'Brochures & Dossiers d’Investissement',
        desc: 'Plaquettes commerciales, catalogues produits et rapports annuels éditoriaux avec direction artistique soignée.'
      }
    ],
    bentoFeatures: [
      {
        title: 'Précision Géométrique & Vectorielle',
        desc: 'Tracés vectoriels parfaits au millimètre pour un rendu net de la favicône 16px à l’enseigne 10 mètres.',
        metric: 'Vecteur Pur'
      },
      {
        title: 'Palette Chromatique Propriétaire',
        desc: 'Sélection rigoureuse des teintes officielles (Pantone, CMJN, RVB, HEX) pour une cohérence sans faille.',
        metric: 'Cohérence'
      },
      {
        title: 'Livrables Multi-Formats Déployables',
        desc: 'Export dans tous les formats professionnels (SVG, AI, PDF vectoriel, PNG transparent haute résolution).',
        metric: 'Tous Formats'
      }
    ],
    deliverables: [
      'Livre de marque officiel (Brand Book PDF imprimable & digital)',
      'Pack complet des déclinaisons du logotype',
      'Palette de couleurs officielles & typographies sous licence',
      'Gabarits de papeterie prêts pour l’imprimeur',
      'Modèles pour présentations PowerPoint et Keynote'
    ],
    heroImage: '/portfolio/branding/capassur-charte-cover.jpg',
    relatedProjectIds: ['gueliz-properties', 'capassur']
  },

  'social-media': {
    slug: 'social-media',
    categoryNumber: '03',
    title: 'Social Media & Community Management',
    tagline: 'Stratégie de contenu éditoriale, animation de communautés et campagnes d’acquisition Meta.',
    heroExcerpt: 'Nous transformons vos canaux sociaux en leviers de notoriété et de génération de prospects qualifiés grâce à une production visuelle statutaire et un ciblage publicitaire chirurgical.',
    overview: 'Être présent sur les réseaux sociaux ne suffit pas : il faut y incarner une voix singulière. SALI DigiCom conçoit des lignes éditoriales élégantes et engageantes qui valorisent votre expertise et génèrent un flux constant d’opportunités commerciales.',
    subServices: [
      {
        title: 'Gestion & Animation des Réseaux Sociaux',
        desc: 'Planification éditoriale stratégique, rédaction des publications et animation continue de vos communautés LinkedIn et Instagram.'
      },
      {
        title: 'Campagnes Publicitaires Meta Ads & LinkedIn',
        desc: 'Création et optimisation de campagnes publicitaires sponsorisées pour générer des leads qualifiés à un coût maîtrisé.'
      },
      {
        title: 'Création Graphique & Direction Artistique Social',
        desc: 'Conception de carrousels éducatifs, visuels de campagnes, animations motion design et bannières statutaires.'
      },
      {
        title: 'Audit Digital & Stratégie d’Acquisition',
        desc: 'Analyse concurrentielle approfondie, identification des points de friction et recommandation stratégique sur mesure.'
      }
    ],
    bentoFeatures: [
      {
        title: 'Contenus Exclusifs & Zéro Banques d’Images',
        desc: 'Visuels sur-mesure respectant scrupuleusement la charte de votre marque sans images génériques.',
        metric: '100% Unique'
      },
      {
        title: 'Optimisation Continue du CPL',
        desc: 'A/B testing rigoureux des accroches, créas et audiences pour réduire le coût par prospect qualifié.',
        metric: 'ROI Ciblé'
      },
      {
        title: 'Reporting & Analyse Mensuelle',
        desc: 'Tableaux de bord transparents détaillant les KPI réels : portée, engagement, clics et conversions.',
        metric: 'KPI Clairs'
      }
    ],
    deliverables: [
      'Calendrier éditorial mensuel validé à l’avance',
      'Créations visuelles adaptées aux ratios 1:1, 4:5 et 9:16',
      'Textes percutants sans poncifs d’intelligence artificielle',
      'Gestion et optimisation des budgets publicitaires',
      'Rapport analytique mensuel avec préconisations'
    ],
    heroImage: '/portfolio/axeon/axeon-campagne-01.jpg',
    relatedProjectIds: ['axeon-media']
  },

  'ia-solutions': {
    slug: 'ia-solutions',
    categoryNumber: '04',
    title: 'Solutions IA & Automatisation',
    tagline: 'Agents conversationnels intelligents, automatisation CRM et flux de devis instantanés.',
    heroExcerpt: 'Nous déployons les dernières technologies d’intelligence artificielle générative pour automatiser vos tâches chronophages, qualifier vos prospects 24/7 et accélérer vos prises de contact.',
    overview: 'L’automatisation intelligente est le plus puissant multiplicateur de croissance moderne. Nous intégrons des agents et des flux sur-mesure directement connectés à vos outils métiers (CRM, WhatsApp, boîte mail) pour offrir une réactivité immédiate à vos prospects.',
    subServices: [
      {
        title: 'Chatbots IA Intelligents (Web & WhatsApp)',
        desc: 'Agents conversationnels formés sur votre documentation d’entreprise pour répondre aux questions et qualifier les leads jour et nuit.'
      },
      {
        title: 'Assistants IA Personnalisés Métiers',
        desc: 'Outils d’IA internes pour aider vos équipes à synthétiser des documents, préparer des devis ou trier des demandes complexes.'
      },
      {
        title: 'Automatisation CRM, Devis & Emailing',
        desc: 'Envoi automatique de propositions, notifications WhatsApp d’alertes d’équipe et synchronisation en temps réel de votre base de données.'
      },
      {
        title: 'Conseil & Accompagnement Stratégique IA',
        desc: 'Audit de vos processus opérationnels et feuille de route pragmatique pour intégrer l’IA là où la rentabilité est immédiate.'
      }
    ],
    bentoFeatures: [
      {
        title: 'Disponibilité Totale Sans Interruption',
        desc: 'Prise en charge instantanée de chaque visiteur en quelques secondes, même le week-end et en dehors des heures de bureau.',
        metric: '24/7/365'
      },
      {
        title: 'Confidentialité & Données Sécurisées',
        desc: 'Modèles cloisonnés respectant la confidentialité stricte de vos données d’entreprise sans entraînement public.',
        metric: 'Sécurisé'
      },
      {
        title: 'Réduction Drastique des Délais',
        desc: 'Automatisation de la chaîne de cadrage et transmission des besoins en moins de 30 secondes au commercial.',
        metric: '-85% Temps'
      }
    ],
    deliverables: [
      'Architecture et configuration de l’agent conversationnel',
      'Base de connaissances d’entreprise structurée et indexée',
      'Connexions API avec WhatsApp Business, CRM et messagerie',
      'Tableau de bord de suivi des conversations et leads qualifiés',
      'Session de prise en main et formation des collaborateurs'
    ],
    heroImage: '/portfolio/websites/imtiaz-mobile.jpg',
    relatedProjectIds: ['imtiaz-taamine', 'cap-investment']
  }
};
