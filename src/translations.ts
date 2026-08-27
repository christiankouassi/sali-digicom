export type Language = 'fr' | 'en' | 'ar';

export interface TranslationDictionary {
  sidebar: {
    logoAlt: string;
    integrity: string;
    performance: string;
    innovation: string;
    globalVision: string;
    engagement: string;
    backBtn: string;
    holdingName: string;
    allRightsReserved?: string;
  };
  menu: {
    holding: string;
    commodities: string;
    dassouli: string;
    digicom: string;
    contact: string;
    desc: string;
    footerEmail: string;
    footerPhone: string;
  };
  sections: {
    main: string[];
    commodities: string[];
    dassouli: string[];
    digicom: string[];
  };
  hero: {
    investmentComp: string;
    desc: string;
    btnDiscover: string;
    btnSubs: string;
    scroll: string;
  };
  about: {
    title: string;
    tag: string;
    desc: string;
    pills: {
      integrity: string;
      performance: string;
      innovation: string;
      globalVision: string;
      engagement: string;
    };
    pillTexts: {
      integrity: string;
      performance: string;
      innovation: string;
      globalVision: string;
      engagement: string;
    };
    btnExpertise: string;
  };
  expertise: {
    title: string;
    subtitle: string;
    holding: string;
    subs: {
      holding: {
        title: string;
        desc: string;
        btn: string;
      };
      commodities: {
        title: string;
        desc: string;
        btn: string;
      };
      dassouli: {
        title: string;
        desc: string;
        btn: string;
      };
      digicom: {
        title: string;
        desc: string;
        btn: string;
      };
    };
  };
  contact: {
    title: string;
    spanFuture: string;
    tag: string;
    phone: string;
    email: string;
    formTitle: string;
    formTitleCommodities: string;
    formTitleDassouli: string;
    formTitleDigicom: string;
    fullName: string;
    emailLabel: string;
    phoneLabel: string;
    subjectLabel: string;
    messageLabel: string;
    companyLabel: string;
    roleLabel: string;
    conceptLabel: string;
    placeholderName: string;
    placeholderEmail: string;
    placeholderPhone: string;
    placeholderSubject: string;
    placeholderMessage: string;
    placeholderMessageCommodities: string;
    placeholderMessageDassouli: string;
    placeholderMessageDigicom: string;
    placeholderCompany: string;
    placeholderConcept: string;
    btnSend: string;
    btnSendCommodities: string;
    btnSendDassouli: string;
    btnSendDigicom: string;
    successTitle: string;
    successTitleDassouli: string;
    successDesc: string;
    successDescCommodities: string;
    successDescDassouli: string;
    successDescDigicom: string;
    btnWriteAnother: string;
    btnWriteAnotherDassouli: string;
    commercialLease: string;
    roles: {
      distributor: string;
      broker: string;
      producer: string;
      other: string;
    };
  };
  commodities: {
    importExportTag: string;
    servicesTitle: string;
    servicesSubtitle: string;
    servicesDesc: string;
    coordinationTag: string;
    coordTitle: string;
    coordSubtitle: string;
    coordDesc: string;
    terroirTag: string;
    moroccoTitle: string;
    moroccoSubtitle: string;
    moroccoDesc: string;
    moroccoFooter: string;
    southSouthTag: string;
    tropTitle: string;
    tropSubtitle: string;
    tropDesc: string;
    tropFooter: string;
    marketsTag: string;
    marketsTitle: string;
    marketsSubtitle: string;
    marketsDesc: string;
    certifiedOrigin: string;
    strictControl: string;
    selection: string;
    services: {
      sourcing: {
        title: string;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
        p5?: string;
      };
      commercial: {
        title: string;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
        p5?: string;
      };
      logistics: {
        title: string;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
        p5?: string;
      };
      quality: {
        title: string;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
        p5?: string;
      };
      storage: {
        title: string;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
        p5?: string;
      };
      brand: {
        title: string;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
        p5?: string;
      };
      admin: {
        title: string;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
        p5?: string;
        p6?: string;
      };
      consulting: {
        title: string;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
        p5?: string;
      };
      digital: {
        title: string;
        p1: string;
        p2: string;
        p3: string;
        p4: string;
        p5?: string;
      };
    };
    products: {
      citrus: {
        name: string;
        cat: string;
        desc: string;
      };
      tomatoes: {
        name: string;
        cat: string;
        desc: string;
      };
      berries: {
        name: string;
        cat: string;
        desc: string;
      };
      oliveOil: {
        name: string;
        cat: string;
        desc: string;
      };
      avocado: {
        name: string;
        cat: string;
        desc: string;
      };
      cashew: {
        name: string;
        cat: string;
        desc: string;
      };
      mango: {
        name: string;
        cat: string;
        desc: string;
      };
      driedMango: {
        name: string;
        cat: string;
        desc: string;
      };
      mangoPuree: {
        name: string;
        cat: string;
        desc: string;
      };
      onion: {
        name: string;
        cat: string;
        desc: string;
      };
    };
  };
  dassouli: {
    tag: string;
    title: string;
    titleSpan: string;
    titleEnd: string;
    address: string;
    desc: string;
    specs: {
      areaLabel: string;
      areaValue: string;
      mallLabel: string;
      mallValue: string;
      leaseLabel: string;
      leaseValue: string;
      servicesLabel: string;
      servicesValue: string;
    };
    btnCandidacy: string;
    availability: string;
    sideTitle: string;
    sideSubtitle: string;
    sideDesc: string;
    sideFooter: string;
    galleryTag: string;
    galleryTitle: string;
    gallerySubtitle: string;
    galleryDesc: string;
    photos: {
      p1: { title: string; desc: string };
      p2: { title: string; desc: string };
      p3: { title: string; desc: string };
      p4: { title: string; desc: string };
    };
  };
  digicom: {
    heroSubtitle: string;
    webTitle: string;
    webDesc: string;
    brandingTitle: string;
    brandingDesc: string;
    marketingTitle: string;
    marketingDesc: string;
    aiTitle: string;
    aiDesc: string;
    approachTitle: string;
    approachDesc: string;
    valuesTitle: string;
    valuesDesc: string;
    reachTitle: string;
    reachDesc: string;
    webServices: {
      landing: { title: string; desc: string };
      showcase: { title: string; desc: string };
      corporate: { title: string; desc: string };
      ecommerce: { title: string; desc: string };
      maintenance: { title: string; desc: string };
    };
    brandingServices: {
      logo: { title: string; desc: string };
      charte: { title: string; desc: string };
      card: { title: string; desc: string };
      brochure: { title: string; desc: string };
    };
    marketingServices: {
      social: { title: string; desc: string };
      ads: { title: string; desc: string };
      audit: { title: string; desc: string };
    };
    aiServices: {
      chatbot: { title: string; desc: string };
      assistant: { title: string; desc: string };
      automation: { title: string; desc: string };
      consulting: { title: string; desc: string };
    };
    valuesList: {
      strategy: { title: string; desc: string };
      creativity: { title: string; desc: string };
      performance: { title: string; desc: string };
      support: { title: string; desc: string };
    };
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  fr: {
    sidebar: {
      logoAlt: "SALI CAPITAL",
      integrity: "Intégrité",
      performance: "Performance",
      innovation: "Innovation",
      globalVision: "Vision globale",
      engagement: "Engagement",
      backBtn: "Retour aux filiales",
      holdingName: "SALI Capital"
    },
    menu: {
      holding: "SALI Capital",
      commodities: "SALI Commodities",
      dassouli: "Foncière Dassouli",
      digicom: "SALI DigiCom",
      contact: "Nous contacter",
      desc: "SALI CAPITAL est un acteur majeur de l'investissement privé, accompagnant le développement économique à travers des solutions innovantes et durables.",
      footerEmail: "hd@sali-capital.com",
      footerPhone: "+212 6 61 37 39 37"
    },
    sections: {
      main: ['Accueil', 'Qui sommes-nous ?', 'Nos filiales', 'Contact'],
      commodities: ['SALI Commodities', 'Nos services', 'Nos services', 'Marque blanche', 'Conseil & digital', 'Origine Maroc', 'Produits internationaux', 'Nos marchés', 'Rejoignez notre réseau'],
      dassouli: ['Foncière Dassouli', 'Nos locaux disponibles', 'Contact'],
      digicom: ['SALI DigiCom', 'Pôle Web', 'Pôle Branding', 'Pôle Marketing', 'Pôle IA & Automatisation', 'Notre approche', 'Nos valeurs', 'Notre portée', 'Contact']
    },
    hero: {
      investmentComp: "Société d’investissement",
      desc: "Derrière chaque filiale, une stratégie. Derrière chaque investissement, une conviction. Notre holding orchestre des expertises complémentaires au service du Maroc de demain.",
      btnDiscover: "Découvrir le groupe",
      btnSubs: "Nos filiales",
      scroll: "Défiler"
    },
    about: {
      title: "Un groupe bâti pour durer et pensé pour croître.",
      tag: "Qui sommes-nous ?",
      desc: "SALI Capital n'investit pas dans des secteurs. Elle investit dans des opportunités choisies avec conviction et pilotées avec exigence. Un groupe en mouvement : des activités établies en immobilier et dans l’import-export, des verticales en construction en finance et dans la tech, et un horizon qui s'étend du Maroc à l'Afrique et au-delà.",
      pills: {
        integrity: "Intégrité",
        performance: "Performance",
        innovation: "Innovation",
        globalVision: "Vision globale",
        engagement: "Engagement"
      },
      pillTexts: {
        integrity: "Nous plaçons l'éthique au cœur de nos décisions. Pour SALI Capital, chaque relation d'affaires repose sur une transparence absolue et le respect rigoureux de nos engagements.",
        performance: "Notre quête de l'excellence guide l'évaluation et le pilotage de nos investissements, garantissant une croissance solide et des retours pérennes pour l'ensemble du groupe.",
        innovation: "Nous anticipons les mutations économiques en développant des solutions innovantes, transformant les défis sectoriels en opportunités stratégiques d'avenir.",
        globalVision: "Notre ambition dépasse les frontières. Tout en restant connectés au développement du Maroc, nous ciblons des relais de croissance durables.",
        engagement: "Nous sommes engagés pour un impact positif et durable, en valorisant le potentiel humain et en soutenant des projets créateurs de valeur sociale et économique."
      },
      btnExpertise: "Nos expertises"
    },
    expertise: {
      title: "Nos",
      subtitle: "Filiales",
      holding: "Expertise multi sectorielle",
      subs: {
        holding: {
          title: "SALI Capital",
          desc: "Holding pilotant le développement et la vision du groupe.",
          btn: "En savoir plus"
        },
        commodities: {
          title: "SALI Commodities",
          desc: "Société d’import-export, spécialisée dans l’agro-alimentaire ainsi que les matières premières.",
          btn: "En savoir plus"
        },
        dassouli: {
          title: "Foncière Dassouli",
          desc: "Société immobilière, spécialisée dans l’investissement locatif en locaux commerciaux.",
          btn: "En savoir plus"
        },
        digicom: {
          title: "SALI DigiCom",
          desc: "Agence de marketing et communication digitale.",
          btn: "En savoir plus"
        }
      }
    },
    contact: {
      title: "Contactez-nous",
      spanFuture: "",
      tag: "Contactez-nous",
      phone: "Téléphone",
      email: "E-MAIL",
      formTitle: "Un intérêt ou une synergie avec l’une de nos filiales? Écrivez-nous.",
      formTitleCommodities: "Vous avez de l’intérêt sur l’un de nos produits ? Vous avez des produits à nous proposer ? Écrivez-nous",
      formTitleDassouli: "Intéressés ? Demandez une visite ou un complément d'information",
      formTitleDigicom: "Vous avez un projet de site web, d'identité de marque ou d'intégration d'IA ? Parlez-en à nos experts.",
      fullName: "Nom complet",
      emailLabel: "E-MAIL",
      phoneLabel: "Téléphone",
      subjectLabel: "Sujet",
      messageLabel: "Message",
      companyLabel: "Entreprise",
      roleLabel: "Profil / rôle",
      conceptLabel: "Enseigne",
      placeholderName: "Votre nom...",
      placeholderEmail: "Votre adresse e-mail",
      placeholderPhone: "Votre numéro de téléphone",
      placeholderSubject: "Comment pouvons-nous vous aider ?",
      placeholderMessage: "Comment pouvons-nous vous aider ?",
      placeholderMessageCommodities: "Comment pouvons-nous vous aider ?",
      placeholderMessageDassouli: "Comment pouvons-nous vous aider ?",
      placeholderMessageDigicom: "Décrivez votre projet (site web, branding, IA, publicité...)",
      placeholderCompany: "Votre société...",
      placeholderConcept: "Votre enseigne",
      btnSend: "Envoyer",
      btnSendCommodities: "Envoyer ma proposition",
      btnSendDassouli: "Soumettre ma demande",
      btnSendDigicom: "Lancer mon projet",
      successTitle: "Message transmis !",
      successTitleDassouli: "Candidature reçue !",
      successDesc: "Votre message a été transmis avec succès et redirigé vers l'adresse de la holding : hd@sali-capital.com. Notre équipe étudiera votre proposition de partenariat sous 24h ouvrées.",
      successDescCommodities: "Votre dossier d'intérêt Commodities a été transmis vers le bureau principal : hd@sali-capital.com. Nous reviendrons vers vous sous 24h.",
      successDescDassouli: "Votre dossier de candidature a été transmis au bureau de gestion foncière : hd@sali-capital.com. Nous l'analyserons pour revenir vers vous sous les plus brefs délais.",
      successDescDigicom: "Votre demande de projet digital a été transmise avec succès à l'équipe SALI DigiCom : contact@sali-digicom.com. Nous vous recontacterons sous 24h.",
      btnWriteAnother: "Rédiger un autre message",
      btnWriteAnotherDassouli: "Soumettre un autre dossier",
      commercialLease: "Bail commercial 3/6/9",
      roles: {
        distributor: "Distributeur / importateur",
        broker: "Intermédiaire / courtier",
        producer: "Producteur / coopérative",
        other: "Autre acteur de la filière"
      }
    },
    commodities: {
      importExportTag: "Import-export",
      servicesTitle: "Nos services",
      servicesSubtitle: "",
      servicesDesc: "Nous orchestrons de bout en bout l'approvisionnement, la certification de conformité et l'expédition de matières agro-alimentaires d'exception vers vos plateformes. Le tout reposant sur un réseau d'origine agile et une logistique internationale éprouvée. L’ensemble de nos services internalisés ou externalisés avec des partenaires de confiance.",
      coordinationTag: "Import-export",
      coordTitle: "Nos services",
      coordSubtitle: "Marque blanche",
      coordDesc: "Nous créons de la valeur sur vos produits existants et votre marque. En marque blanche, ou avec votre marque existante, nous proposons vos produits à l'export à notre réseau et nous occupons de l'intégralité de la chaîne menant à l'export de votre produit.",
      terroirTag: "Import-export",
      moroccoTitle: "Nos produits",
      moroccoSubtitle: "Origine Maroc",
      moroccoDesc: "Nous bâtissons notre réseau de producteurs locaux sur la base de la confiance mutuelle et de la qualité de leurs produits. Le terroir marocain est riche et nos agriculteurs cultivent des fruits, maraîchages et huiles d'exception respectueux de l'environnement et acheminés dans conditions adaptées au produit afin de permettre une qualité optimale du produit exporté à son arrivée à destination. La liste des produits est non-exhaustive et nous pouvons, via notre réseau vous donner accès à d'autres produits sur demande.",
      moroccoFooter: "",
      southSouthTag: "Produits internationaux",
      tropTitle: "Nos produits",
      tropSubtitle: "Produits internationaux",
      tropDesc: "A travers notre réseau de producteurs en Afrique de l’Ouest, nous vous donnons accès à des produits d’une qualité hors du commun dont notamment (liste non exhaustive) : les noix de cajou, les oignons déshydratés ainsi que la mangue (fraîche, séchée ou en purée).",
      tropFooter: "",
      marketsTag: "Import-export",
      marketsTitle: "Nos marchés",
      marketsSubtitle: "Réseau & contact",
      marketsDesc: "En constante évolution, notre réseau actuel comprend des importateurs et exportateurs situés en Europe, en Afrique ainsi qu'en Asie.",
      certifiedOrigin: "Origine certifiée",
      strictControl: "Strict contrôle",
      selection: "Sélection",
      services: {
        sourcing: {
          title: "Sourcing & approvisionnement",
          p1: "Identification et qualification de producteurs/fournisseurs locaux",
          p2: "Création de centrales d'achat locales pour distributeurs étrangers",
          p3: "Constitution de réseaux de producteurs par filière ou région",
          p4: "Négociation des conditions d'achat et des contrats fournisseurs",
          p5: "Consolidation de volumes entre plusieurs petits producteurs"
        },
        commercial: {
          title: "Développement commercial & mise en relation",
          p1: "Mise en relation entre producteurs locaux et acheteurs internationaux",
          p2: "Représentation commerciale de producteurs locaux à l'export",
          p3: "Prospection et qualification de clients à l'étranger",
          p4: "Participation et représentation sur des salons internationaux",
          p5: "Mise en relation avec des importateurs, grossistes et distributeurs étrangers"
        },
        logistics: {
          title: "Logistique & transport",
          p1: "Mise en relation avec des sociétés de fret (maritime, aérien, routier)",
          p2: "Coordination logistique de bout en bout (de la ferme au port)",
          p3: "Gestion des transitaires et des opérations douanières",
          p4: "Optimisation des coûts de transport et des routes logistiques",
          p5: "Gestion des incoterms et des contrats de transport"
        },
        quality: {
          title: "Qualité & conformité",
          p1: "Mise en relation avec des sociétés de contrôle qualité et d'inspection",
          p2: "Accompagnement à l'obtention de certifications (GlobalGAP, Bio, Halal, ISO...)",
          p3: "Vérification de la conformité aux normes des marchés cibles",
          p4: "Gestion des analyses et tests laboratoire",
          p5: "Accompagnement aux audits fournisseurs"
        },
        storage: {
          title: "Stockage, conditionnement & emballage",
          p1: "Mise en relation avec des entités de stockage et chambres froides",
          p2: "Mise en relation avec des unités de conditionnement et d'emballage",
          p3: "Conception et sourcing d'emballages adaptés aux marchés cibles",
          p4: "Gestion du tri, calibrage et préparation des produits à l'export",
          p5: "Optimisation des formats d'emballage selon les exigences acheteurs"
        },
        brand: {
          title: "Marque & produit",
          p1: "Création de marques en white label sur des produits ciblés",
          p2: "Développement de marques propres à destination de marchés spécifiques",
          p3: "Conseil en positionnement produit et packaging selon le marché cible",
          p4: "Développement de gammes sous marque de distributeur (MDD)",
          p5: "Protection de marques et dépôts à l'international"
        },
        admin: {
          title: "Administratif, juridique & financier",
          p1: "Accompagnement à la constitution de dossiers d'export",
          p2: "Gestion documentaire (certificats d'origine, phytosanitaires, douanes...)",
          p3: "Mise en relation avec des banques et organismes de financement du commerce",
          p4: "Structuration de contrats commerciaux import/export",
          p5: "Accompagnement sur les mécanismes de paiement internationaux (LC, CAD, virement SWIFT...)",
          p6: "Couverture des risques de change"
        },
        consulting: {
          title: "Conseil & stratégie",
          p1: "Étude de marché et analyse de la demande sur les marchés cibles",
          p2: "Conseil en stratégie d'entrée sur un nouveau marché",
          p3: "Veille concurrentielle et tarifaire",
          p4: "Conseil en diversification de gamme selon les opportunités export",
          p5: "Accompagnement à la mise en conformité réglementaire par pays"
        },
        digital: {
          title: "Services digitaux & data",
          p1: "Mise en place de plateformes de mise en relation B2B",
          p2: "Création de catalogues produits digitaux à destination des acheteurs",
          p3: "Référencement sur des marketplaces B2B internationales",
          p4: "Outils de traçabilité et suivi de commandes"
        }
      },
      products: {
        citrus: {
          name: "Agrumes du Maroc",
          cat: "Fruits frais - Maroc",
          desc: "Clémentines de Berkane, oranges Navel et Maroc Late parfumées, célèbres mondialement pour leur goût très sucré."
        },
        tomatoes: {
          name: "Tomates rondes & cerises",
          cat: "Maraîchage - Maroc",
          desc: "Tomates cultivées sous serres modernes, destinées aux exigences européennes."
        },
        berries: {
          name: "Fruits rouges",
          cat: "Fruits frais - Maroc",
          desc: "Sélection premium de framboises, myrtilles et fraises cultivées avec passion."
        },
        oliveOil: {
          name: "Huile d’olive extra-vierge",
          cat: "Terroir - Maroc",
          desc: "Huile vierge extra d'oliviers picholine marocaine au goût intense et récoltés traditionnellement."
        },
        avocado: {
          name: "Avocats du Maroc",
          cat: "Maraîchage - Maroc",
          desc: "Avocats hass crémeux de premier choix récoltés avec professionnalisme et exportés sous contrôle strict."
        },
        cashew: {
          name: "Noix de cajou",
          cat: "Produits d’Afrique",
          desc: "Noix de cajou brutes de haute qualité sélectionnées minutieusement auprès de nos coopératives partenaires."
        },
        mango: {
          name: "Mangues fraîches",
          cat: "Produits d’Afrique",
          desc: "Mangues d'exception récoltées gorgées de sève pour garantir un parfum exceptionnel."
        },
        driedMango: {
          name: "Mangues séchées",
          cat: "Produits d’Afrique / snacking",
          desc: "Tranches moelleuses séchées sans sucres ajoutés ni sulfites pour un en-cas énergétique premium."
        },
        mangoPuree: {
          name: "Purée de mangue",
          cat: "Produits d’Afrique / industrie",
          desc: "Purée fluide 100% naturelle extraite à froid à maturité optimale pour conserver toute la rondeur aromatique."
        },
        onion: {
          name: "Poudre d’oignon déshydraté",
          cat: "Produits d’Afrique / ingrédients",
          desc: "Oignons séchés et finement broyés, extrêmement aromatiques pour l'assaisonnement de recettes culinaires."
        }
      },
    },
    digicom: {
      heroSubtitle: "Agence de Marketing & Communication Digitale",
      webTitle: "Conception & Développement",
      webDesc: "Nous concevons et développons des plateformes web performantes, sécurisées et optimisées pour le référencement naturel, pensées pour engager vos visiteurs et maximiser vos conversions.",
      brandingTitle: "Identité de Marque & Design",
      brandingDesc: "Donnez vie à votre image de marque grâce à des designs uniques, percutants et mémorables, en parfaite adéquation avec vos valeurs et votre positionnement.",
      marketingTitle: "Stratégie & Visibilité",
      marketingDesc: "Optimisez votre visibilité en ligne, ciblez précisément votre audience et générez des prospects qualifiés grâce à nos stratégies d'acquisition éprouvées.",
      aiTitle: "Intelligence Artificielle & Automatisation",
      aiDesc: "Intégrez l'innovation au cœur de vos processus. Nous développons des solutions d'intelligence artificielle et d'automatisation sur mesure pour booster votre rentabilité.",
      approachTitle: "Notre Approche",
      approachDesc: "Chaque projet commence par une écoute attentive de vos besoins. Nous combinons l'esprit de création artistique à la rigueur technique pour concevoir des expériences numériques remarquables.",
      valuesTitle: "Nos 4 Piliers",
      valuesDesc: "Notre accompagnement repose sur des valeurs fortes garantissant la réussite de votre transformation digitale.",
      reachTitle: "Notre Vision",
      reachDesc: "Basés au Maroc, nous accompagnons les entreprises locales et internationales dans leur transition numérique en leur offrant les dernières technologies d'IA et de marketing digital.",
      webServices: {
        landing: {
          title: "Landing page",
          desc: "Pages d'atterrissage à fort taux de conversion pour vos campagnes."
        },
        showcase: {
          title: "Site vitrine",
          desc: "Présentation élégante, moderne et interactive de votre activité."
        },
        corporate: {
          title: "Site corporate",
          desc: "Portails institutionnels haut de gamme pour les entreprises."
        },
        ecommerce: {
          title: "Site e-commerce",
          desc: "Boutiques en ligne optimisées avec des parcours d'achat fluides."
        },
        maintenance: {
          title: "Maintenance mensuelle",
          desc: "Suivi technique, mises à jour de sécurité et optimisations."
        }
      },
      brandingServices: {
        logo: {
          title: "Création de Logo",
          desc: "Conception de logos uniques, adaptables et mémorables."
        },
        charte: {
          title: "Charte graphique complète",
          desc: "Définition de vos codes typographiques, chromatiques et visuels."
        },
        card: {
          title: "Carte de visite",
          desc: "Supports physiques professionnels de haute qualité."
        },
        brochure: {
          title: "Brochure & Support commercial",
          desc: "Conception de plaquettes et présentations professionnelles."
        }
      },
      marketingServices: {
        social: {
          title: "Gestion des réseaux sociaux",
          desc: "Stratégie de contenu, animation de communautés (Community Management)."
        },
        ads: {
          title: "Campagnes Meta Ads",
          desc: "Publicités ciblées et performantes sur Facebook, Instagram et WhatsApp."
        },
        audit: {
          title: "Audit digital & SEO",
          desc: "Analyse de votre visibilité et optimisation pour les moteurs de recherche."
        }
      },
      aiServices: {
        chatbot: {
          title: "Chatbots IA (Web / WhatsApp)",
          desc: "Agents intelligents disponibles 24/7 pour qualifier vos leads."
        },
        assistant: {
          title: "Assistants IA personnalisés",
          desc: "Outils d'IA entraînés spécifiquement sur vos données métiers."
        },
        automation: {
          title: "Automatisation CRM & Emailing",
          desc: "Optimisation de vos flux de travail et relances clients."
        },
        consulting: {
          title: "Consulting IA en entreprise",
          desc: "Formation de vos équipes et intégration des outils d'IA générative."
        }
      },
      valuesList: {
        strategy: {
          title: "Stratégie",
          desc: "Une vision claire et des objectifs précis pour chaque projet."
        },
        creativity: {
          title: "Créativité",
          desc: "Des idées originales et des designs uniques pour vous démarquer."
        },
        performance: {
          title: "Performance",
          desc: "Un focus constant sur la conversion et le retour sur investissement."
        },
        support: {
          title: "Accompagnement",
          desc: "Une collaboration étroite et un suivi proactif à chaque étape."
        }
      }
    },
    dassouli: {
      tag: "Nos locaux disponibles",
      title: "Local commercial de 70m²",
      titleSpan: "au 1er étage dans le mall B-Time (Ville Verte)",
      titleEnd: "",
      address: "1er étage, Mall B-Time, Bouskoura Ville Verte",
      desc: "Local commercial de 70 m² au premier étage du Mall B-Time, Bouskoura Ville Verte. Espace fonctionnel bénéficiant d'un emplacement de choix et d'une visibilité optimale. Pour plus d'informations sur le local, contactez-nous",
      specs: {
        areaLabel: "Superficie brute :",
        areaValue: "70 m²",
        mallLabel: "B-Time Mall :",
        mallValue: "Ville Verte Bouskoura",
        leaseLabel: "Type de bail :",
        leaseValue: "Bail commercial 3/6/9",
        servicesLabel: "Prestations :",
        servicesValue: "Sorties fluides & gainé"
      },
      btnCandidacy: "Signalement d’intérêt",
      availability: "Disponibilité immédiate",
      sideTitle: "Gestion patrimoniale",
      sideSubtitle: "Valoriser l'immobilier commercial",
      sideDesc: "Nous sélectionnons rigoureusement des adresses de choix à forte valeur locative pour y asseoir des concepts commerciaux de premier ordre.",
      sideFooter: "Complexe B-TIME Bouskoura",
      galleryTag: "Galerie photo du local",
      galleryTitle: "Espaces &",
      gallerySubtitle: "Aménagements",
      galleryDesc: "Naviguez parmi les prises de vue réelles du complexe et découvrez les modélisations d’aménagements du local sur la base des dimensions réelles de celui-ci.",
      photos: {
        p1: {
          title: "VUE EXTÉRIEURE 1 - B-TIME MALL",
          desc: "Vue extérieure 1 - Mall B-Time."
        },
        p2: {
          title: "VUE EXTÉRIEURE 2 - MALL B-TIME",
          desc: "Vue extérieure 2 - Mall B-Time."
        },
        p3: {
          title: "INTÉRIEUR MODÉLISATION 1",
          desc: "Exemple de modélisation d’aménagement du local en Juice Bar."
        },
        p4: {
          title: "INTÉRIEUR MODÉLISATION 2",
          desc: "Exemple de modélisation d’aménagement du local en showroom mobilier et déco."
        }
      }
    }
  },
  en: {
    sidebar: {
      logoAlt: "SALI CAPITAL",
      integrity: "Integrity",
      performance: "Performance",
      innovation: "Innovation",
      globalVision: "Global vision",
      engagement: "Engagement",
      backBtn: "Back to Subsidiaries",
      holdingName: "SALI Capital"
    },
    menu: {
      holding: "SALI Capital",
      commodities: "SALI Commodities",
      dassouli: "Foncière Dassouli",
      digicom: "SALI DigiCom",
      contact: "Contact Us",
      desc: "SALI CAPITAL is a major player in private investment, supporting economic development through innovative and sustainable solutions.",
      footerEmail: "hd@sali-capital.com",
      footerPhone: "+212 6 61 37 39 37"
    },
    sections: {
      main: ['Home', 'Who We Are', 'Our Subsidiaries', 'Contact'],
      commodities: ['SALI Commodities', 'Our services', 'Our services', 'White label', 'Advisory & digital', 'Morocco origin', 'International products', 'Our markets', 'Join our network'],
      dassouli: ['Foncière Dassouli', 'Our available premises', 'Contact'],
      digicom: ['SALI DigiCom', 'Web Department', 'Branding Department', 'Marketing Department', 'AI & Automation', 'Our Approach', 'Our Values', 'Our Reach', 'Contact']
    },
    hero: {
      investmentComp: "INVESTMENT COMPANY",
      desc: "Behind every subsidiary, a strategy. Behind every investment, a conviction. Our holding company orchestrates complementary expertise to serve the Morocco of tomorrow.",
      btnDiscover: "Discover the Group",
      btnSubs: "Our Subsidiaries",
      scroll: "Scroll"
    },
    about: {
      title: "A group built to last and designed to grow.",
      tag: "Who We Are",
      desc: "SALI Capital does not just invest in sectors; it invests in selected opportunities with conviction and drives them with high standards. A group in motion: established operations in real estate and import-export, developing verticals in construction, finance, and tech, with horizons extending from Morocco to Africa and beyond.",
      pills: {
        integrity: "Integrity",
        performance: "Performance",
        innovation: "Innovation",
        globalVision: "Global vision",
        engagement: "Commitment"
      },
      pillTexts: {
        integrity: "We place ethics at the heart of our decisions. For SALI Capital, every business relationship is based on absolute transparency and rigorous respect for our commitments.",
        performance: "Our pursuit of excellence guides the evaluation and monitoring of our investments, ensuring solid growth and sustainable returns for the entire group.",
        innovation: "We anticipate economic changes by developing innovative solutions, transforming industry challenges into strategic opportunities of the future.",
        globalVision: "Our ambition knows no borders. While remaining connected to the development of Morocco, we target growth drivers beyond continents.",
        engagement: "We are committed to a positive and sustainable impact by valuing human potential and supporting projects that create social and economic value."
      },
      btnExpertise: "Our Subsidiaries"
    },
    expertise: {
      title: "Our",
      subtitle: "Subsidiaries",
      holding: "Multisectoral Expertise",
      subs: {
        holding: {
          title: "SALI Capital",
          desc: "Holding company directing the development and vision of the group.",
          btn: "Learn more"
        },
        commodities: {
          title: "SALI Commodities",
          desc: "Import-export company specializing in agri-food and agricultural raw materials.",
          btn: "Learn more"
        },
        dassouli: {
          title: "Foncière Dassouli",
          desc: "Real estate investment company specializing in commercial property rentals.",
          btn: "Learn more"
        },
        digicom: {
          title: "SALI DigiCom",
          desc: "Digital marketing and communication agency.",
          btn: "Learn more"
        }
      }
    },
    contact: {
      title: "Contact Us",
      spanFuture: "",
      tag: "Contact Us",
      phone: "Phone",
      email: "Email",
      formTitle: "Have a project? Write to us",
      formTitleCommodities: "Are you interested in one of our products? Do you have products to offer us? Write to us",
      formTitleDassouli: "Interested? Request a visit or additional information",
      formTitleDigicom: "Do you have a website, brand identity, or AI integration project? Let's discuss it.",
      fullName: "Full Name",
      emailLabel: "Email",
      phoneLabel: "Phone Number",
      subjectLabel: "Subject",
      messageLabel: "Message",
      companyLabel: "Company",
      roleLabel: "Profile / Role",
      conceptLabel: "Brand",
      placeholderName: "Your name...",
      placeholderEmail: "your@email.com",
      placeholderPhone: "Your phone number",
      placeholderSubject: "How can we help?",
      placeholderMessage: "How can we help?",
      placeholderMessageCommodities: "How can we help?",
      placeholderMessageDassouli: "How can we help?",
      placeholderMessageDigicom: "Describe your project (website, branding, AI, ads...)",
      placeholderCompany: "Your company...",
      placeholderConcept: "Your brand",
      btnSend: "Send Message",
      btnSendCommodities: "Submit Proposal",
      btnSendDassouli: "Submit my request",
      btnSendDigicom: "Launch My Project",
      successTitle: "Message Sent!",
      successTitleDassouli: "Application Received!",
      successDesc: "Your message has been successfully sent and redirected to the holding address: hd@sali-capital.com. Our team will review your partnership proposal within 24 business hours.",
      successDescCommodities: "Your Commodities inquiry has been transmitted to the head office: hd@sali-capital.com. We will get back to you within 24 hours.",
      successDescDassouli: "Your application file has been successfully sent to the property management office: hd@sali-capital.com. We will analyze it and reach out to you as soon as possible.",
      successDescDigicom: "Your digital project request has been successfully transmitted to the SALI DigiCom team: contact@sali-digicom.com. We will contact you within 24 hours.",
      btnWriteAnother: "Write Another Message",
      btnWriteAnotherDassouli: "Submit Another Application",
      commercialLease: "3/6/9 Commercial Lease",
      roles: {
        distributor: "Distributor / Importer",
        broker: "Broker / Intermediary",
        producer: "Producer / Cooperative",
        other: "Other Industry Professional"
      }
    },
    commodities: {
      importExportTag: "IMPORT-EXPORT",
      servicesTitle: "Our services",
      servicesSubtitle: "",
      servicesDesc: "We orchestrate end-to-end supply, quality compliance certification, and shipping of outstanding agri-food products to your platforms. All supported by an agile sourcing network and time-tested international logistics. We ensure smooth coordination to secure your regional and transcontinental supplies.",
      coordinationTag: "IMPORT-EXPORT",
      coordTitle: "Our services",
      coordSubtitle: "Private Label",
      coordDesc: "We create value for your existing products and your brand. In white label, or with your existing brand, we offer your products for export to our network and handle the entire chain leading to the export of your product.",
      terroirTag: "IMPORT-EXPORT",
      moroccoTitle: "Our products",
      moroccoSubtitle: "Morocco Origin",
      moroccoDesc: "We build our network of local producers on the basis of mutual trust and the quality of their products. The Moroccan terroir is rich and our farmers grow exceptional fruits, market vegetables and oils that respect the environment and are transported in conditions adapted to the product in order to allow optimal quality of the exported product upon its arrival at destination. The list of products is non-exhaustive and we can, through our network, give you access to other products on request.",
      moroccoFooter: "",
      southSouthTag: "International products",
      tropTitle: "Our products",
      tropSubtitle: "International products",
      tropDesc: "Through our network of producers in West Africa, we give you access to products of extraordinary quality including (non-exhaustive list): cashew nuts, dehydrated onions, and mango (fresh, dried, or puréed).",
      tropFooter: "",
      marketsTag: "IMPORT-EXPORT",
      marketsTitle: "Our markets",
      marketsSubtitle: "Network & Contact",
      marketsDesc: "In constant evolution, our current network includes importers and exporters located in Europe, Africa, as well as Asia.",
      certifiedOrigin: "CERTIFIED ORIGIN",
      strictControl: "STRICT COMPLIANCE",
      selection: "Selection",
      services: {
        sourcing: {
          title: "Sourcing & Procurement",
          p1: "Identification and qualification of premier local growers",
          p2: "Establishment of dedicated local purchasing centers",
          p3: "Building robust agricultural network channels",
          p4: "Optimal negotiation of procurement terms and pricing"
        },
        commercial: {
          title: "Business Development",
          p1: "Connecting qualified producers with global buyers",
          p2: "Premium international trade representation",
          p3: "Targeted market prospecting and customer prequalification",
          p4: "Direct placement with elite wholesalers and retail networks"
        },
        logistics: {
          title: "Logistics & Shipping",
          p1: "End-to-end logistics coordination from farm to destination port",
          p2: "Strong strategic partnerships with major ocean freight lines",
          p3: "Streamlined customs handling and transit formalities",
          p4: "Deep expertise in complex transport Incoterms"
        },
        quality: {
          title: "Quality Control & Compliance",
          p1: "Rigorous physical audits and pre-shipment inspections",
          p2: "Sourcing global certifications (GlobalGAP, Organic, ISO)",
          p3: "Strict adherence to target market importing regulations",
          p4: "Physicochemical reviews in fully accredited state laboratories"
        },
        storage: {
          title: "Storage & Packaging",
          p1: "Secure routing to approved cold storage and warehouses",
          p2: "Custom sorting, grading, and premium retail packing",
          p3: "Acquisition of sustainable, high-standard packaging materials",
          p4: "Absolute maintenance of cold chain continuity"
        },
        brand: {
          title: "Private Label Development",
          p1: "Bespoke retailer brand (White Label) creation and design",
          p2: "Development of unique graphic identities and packing specs",
          p3: "Strategic market positioning across geo-strategic zones",
          p4: "Technical sign-off on compliant, localized regulatory labeling"
        },
        admin: {
          title: "Admin & Financial Desk",
          p1: "Preparation of complete customs import/export files",
          p2: "Rigorous handling of phytosanitary certifications",
          p3: "Safe, secure banking trade finance solutions",
          p4: "Foreign exchange risk mitigation and hedging"
        },
        consulting: {
          title: "Consulting & Strategy",
          p1: "Forward-looking analyses and comprehensive market studies",
          p2: "Custom commercial launch and penetration strategies",
          p3: "Continuous regulatory, competitor, and tariff monitoring",
          p4: "Agronomic consulting for food range diversification"
        },
        digital: {
          title: "Digital Services & Tracking",
          p1: "Digital product catalogs customized for professional buyers",
          p2: "Enhanced presence across global B2B digital marketplaces",
          p3: "Vessel cargo location tracking and transparency tools",
          p4: "Secure online client portal with shipment documentation"
        }
      },
      products: {
        citrus: {
          name: "Moroccan citrus",
          cat: "Fresh fruits - Morocco",
          desc: "Berkane clementines, Navel oranges and fragrant Morocco Late, celebrated worldwide for their deep, sweet flavor."
        },
        tomatoes: {
          name: "Round & cherry tomatoes",
          cat: "Greenhouses - Morocco",
          desc: "Grown using modern greenhouse practices in Souss-Massa, fully complying with European quality standards."
        },
        berries: {
          name: "Select berries",
          cat: "Fresh fruits - Morocco",
          desc: "An elite selection of raspberries, blueberries and strawberries harvested in the Gharb and Loukkos valleys."
        },
        oliveOil: {
          name: "Extra-virgin olive oil",
          cat: "Terroir - Morocco",
          desc: "Extra virgin oil from traditional Moroccan Picholine olive trees, cold pressed for rich flavor notes."
        },
        avocado: {
          name: "Moroccan avocados",
          cat: "Greenhouses - Morocco",
          desc: "Creamy Hass avocados of first-class caliber grown under Agadir sunshine and exported under rigorous quality protocols."
        },
        cashew: {
          name: "Premium cashew nuts",
          cat: "Dry fruits - Africa",
          desc: "High-grade raw cashew nuts carefully selected and procured directly from West African smallholder cooperatives."
        },
        mango: {
          name: "Fresh mangoes",
          cat: "Fresh fruits - Africa",
          desc: "Exceptional mangoes, picked at prime maturity to guarantee maximum flavor, sweetness and fiber quality."
        },
        driedMango: {
          name: "Dried mangoes",
          cat: "Healthy snacks",
          desc: "Chewy, naturally sweet slices dried carefully without added sugars, colorings, or sulfites."
        },
        mangoPuree: {
          name: "Mango puree",
          cat: "Agro-industrial",
          desc: "100% natural fruit pulp, cold-extracted at optimal maturity to preserve original taste profile."
        },
        onion: {
          name: "Dehydrated onions",
          cat: "Aromatic ingredients",
          desc: "Industry-grade premium onion flakes, kibbled, or fine powder, featuring high culinary aromatics."
        }
      },
    },
    digicom: {
      heroSubtitle: "Digital Marketing & Communication Agency",
      webTitle: "Design & Development",
      webDesc: "We design and develop high-performing, secure, and SEO-optimized web platforms, engineered to engage your visitors and maximize conversions.",
      brandingTitle: "Brand Identity & Design",
      brandingDesc: "Bring your brand image to life through unique, impactful, and memorable designs, in perfect alignment with your values and positioning.",
      marketingTitle: "Strategy & Visibility",
      marketingDesc: "Optimize your online visibility, target your audience precisely, and generate qualified leads through our proven acquisition strategies.",
      aiTitle: "Artificial Intelligence & Automation",
      aiDesc: "Integrate innovation at the core of your processes. We develop bespoke artificial intelligence and automation solutions to boost your profitability.",
      approachTitle: "Our Approach",
      approachDesc: "Every project begins by carefully listening to your needs. We combine artistic creative spirit with technical rigor to build outstanding digital experiences.",
      valuesTitle: "Our 4 Pillars",
      valuesDesc: "Our guidance is based on strong values ensuring the success of your digital transformation.",
      reachTitle: "Our Vision",
      reachDesc: "Based in Morocco, we support local and international companies in their digital transition by offering the latest AI and digital marketing technologies.",
      webServices: {
        landing: {
          title: "Landing page",
          desc: "High-conversion landing pages for your marketing campaigns."
        },
        showcase: {
          title: "Showcase website",
          desc: "Elegant, modern, and interactive online presentation of your business."
        },
        corporate: {
          title: "Corporate website",
          desc: "Premium institutional portals built for companies and groups."
        },
        ecommerce: {
          title: "E-commerce website",
          desc: "Optimized online shops featuring smooth and secure buying journeys."
        },
        maintenance: {
          title: "Monthly maintenance",
          desc: "Technical follow-up, security updates, and performance optimizations."
        }
      },
      brandingServices: {
        logo: {
          title: "Logo Creation",
          desc: "Unique, scalable, and memorable custom logo designs."
        },
        charte: {
          title: "Full Brand Guidelines",
          desc: "Definition of your typographic, chromatic, and visual guidelines."
        },
        card: {
          title: "Business Cards",
          desc: "High-quality professional physical marketing assets."
        },
        brochure: {
          title: "Brochures & Sales Materials",
          desc: "Design of professional pitch decks and company brochures."
        }
      },
      marketingServices: {
        social: {
          title: "Social Media Management",
          desc: "Content strategy, audience engagement, and community building."
        },
        ads: {
          title: "Meta Ads Campaigns",
          desc: "High-performing targeted ads on Facebook, Instagram, and WhatsApp."
        },
        audit: {
          title: "Digital Audit & SEO",
          desc: "Analysis of your visibility and optimization for search engines."
        }
      },
      aiServices: {
        chatbot: {
          title: "AI Chatbots (Web / WhatsApp)",
          desc: "Intelligent agents available 24/7 to qualify your leads."
        },
        assistant: {
          title: "Custom AI Assistants",
          desc: "AI tools trained specifically on your company's data."
        },
        automation: {
          title: "CRM & Emailing Automation",
          desc: "Workflow optimization and automatic client follow-ups."
        },
        consulting: {
          title: "AI Business Consulting",
          desc: "Team training and integration of generative AI tools."
        }
      },
      valuesList: {
        strategy: {
          title: "Strategy",
          desc: "A clear vision and precise goals defined for every project."
        },
        creativity: {
          title: "Creativity",
          desc: "Original ideas and unique designs to set you apart from others."
        },
        performance: {
          title: "Performance",
          desc: "A constant focus on conversion rate and return on investment."
        },
        support: {
          title: "Support",
          desc: "Close collaboration and proactive follow-up at every step."
        }
      }
    },
    dassouli: {
      tag: "Our available premises for rent",
      title: "Commercial space of 70m²",
      titleSpan: "on the 1st floor of the B-Time mall (Ville Verte)",
      titleEnd: "",
      address: "1st Floor, B-Time Mall, Bouskoura Ville Verte",
      desc: "70 m² commercial space located on the first floor of the B-Time Mall in Bouskoura Ville Verte. Ideal for retail, services, or dining, this unit benefits from a strategic location with a steady visitor flow. For more information about this unit, please contact us",
      specs: {
        areaLabel: "Gross Area:",
        areaValue: "70 m²",
        mallLabel: "B-Time Mall:",
        mallValue: "Ville Verte Bouskoura",
        leaseLabel: "Lease Type:",
        leaseValue: "Commercial 3/6/9 Lease",
        servicesLabel: "Services:",
        servicesValue: "Fluid extraction and duct outlets ready"
      },
      btnCandidacy: "EXPRESSION OF INTEREST",
      availability: "Immediate Availability",
      sideTitle: "RETAIL REAL ESTATE",
      sideSubtitle: "Enhancing Commercial Locations",
      sideDesc: "We select and invest in high-demand, high-yield addresses to house retail, service, and dining brand concepts.",
      sideFooter: "B-TIME Bouskoura Complex",
      galleryTag: "UNIT PHOTO GALLERY",
      galleryTitle: "Spaces &",
      gallerySubtitle: "Layouts",
      galleryDesc: "Browse through authentic photographs of the complex and discover the layout models of the premises based on its actual dimensions.",
      photos: {
        p1: {
          title: "EXTERIOR VIEW 1 - B-TIME MALL",
          desc: "Exterior view 1 - Mall B-Time."
        },
        p2: {
          title: "EXTERIOR VIEW 2 - MALL B-TIME",
          desc: "Exterior view 2 - Mall B-Time."
        },
        p3: {
          title: "INTERIOR 3D MODEL 1",
          desc: "Example of layout design of the premises as a Juice Bar."
        },
        p4: {
          title: "INTERIOR 3D MODEL 2",
          desc: "Example of layout design of the premises as a furniture and decor showroom."
        }
      }
    }
  },
  ar: {
    sidebar: {
      logoAlt: "سالي كابيتال",
      integrity: "النزاهة",
      performance: "الأداء",
      innovation: "الابتكار",
      globalVision: "رؤية عالمية",
      engagement: "الالتزام",
      backBtn: "العودة إلى الشركات التابعة",
      holdingName: "سالي كابيتال"
    },
    menu: {
      holding: "سالي كابيتال",
      commodities: "سالي للسلع",
      dassouli: "فونسير الدسولي العقارية",
      digicom: "سالي ديجي كوم",
      contact: "اتصل بنا",
      desc: "تعتبر سالي كابيتال فاعلاً رئيسياً في مجال الاستثمار الخاص، حيث ترافق التنمية الاقتصادية من خلال حلول مبتكرة ومستدامة.",
      footerEmail: "hd@sali-capital.com",
      footerPhone: "+212 6 61 37 39 37"
    },
    sections: {
      main: ['الرئيسية', 'من نحن؟', 'شركاتنا التابعة', 'تواصل معنا'],
      commodities: ['سالي للسلع', 'خدماتنا', 'خدماتنا', 'علامة تجارية خاصة', 'استشارة ورقمنة', 'أصل المغرب', 'منتجات دولية', 'أسواقنا', 'انضم إلى شبكتنا'],
      dassouli: ['فونسير الدسولي', 'عقاراتنا المتاحة', 'الاتصال'],
      digicom: ['سالي ديجي كوم', 'قسم الويب', 'قسم الهوية البصرية', 'التسويق الرقمي', 'الذكاء الاصطناعي', 'منهجيتنا', 'قيمنا', 'رؤيتنا', 'اتصل بنا']
    },
    hero: {
      investmentComp: "شركة استثمارية",
      desc: "خلف كل شركة تابعة استراتيجية. وخلف كل استثمار قناعة راسخة. تنسق مجموعتنا القابضة خبرات متكاملة في خدمة مغرب الغد.",
      btnDiscover: "اكتشف المجموعة",
      btnSubs: "شركاتنا التابعة",
      scroll: "مرر للأسفل"
    },
    about: {
      title: "مجموعة تأسست لتستمر وصُممت لتنمو وتزدهر.",
      tag: "من نحن؟",
      desc: "لا تستثمر سالي كابيتال في القطاعات فحسب، بل في الفرص المختارة بقناعة والمُدارة بأعلى معايير المتطلبات. مجموعة في حركة مستمرة: أنشطة راسخة في العقار والاستيراد والتصدير، ومشاريع واعدة في البناء والتمويل والتكنولوجيا، وأفق يمتد من المغرب إلى إفريقيا وخارجها.",
      pills: {
        integrity: "النزاهة",
        performance: "الأداء",
        innovation: "الابتكار",
        globalVision: "رؤية عالمية",
        engagement: "الالتزام"
      },
      pillTexts: {
        integrity: "نضع الأخلاقيات في قلب قراراتنا. بالنسبة لسالي كابيتال، تقوم كل علاقة عمل على الشفافية المطلقة والاحترام الصارم لالتزاماتنا.",
        performance: "سعينا الدؤوب للتميز يوجه تقييم وإدارة استثماراتنا، مما يضمن نموًا قويًا وعوائد مستدامة للمجموعة بأكملها.",
        innovation: "نستبق التحولات الاقتصادية من خلال تطوير حلول مبتكرة، وتحويل التحديات القطاعية إلى فرص استراتيجية للمستقبل.",
        globalVision: "طموحنا يتجاوز الحدود. مع بقائنا مرتبطين بتنمية وازدهار المغرب، نستهدف محركات نمو واعدة عابرة للقارات.",
        engagement: "نحن ملتزمون بإحداث تأثير إيجابي ومستدام، من خلال إبراز الطاقات البشرية ودعم المشاريع التي تخلق قيمة اجتماعية واقتصادية."
      },
      btnExpertise: "شركاتنا التابعة"
    },
    expertise: {
      title: "شركاتنا",
      subtitle: "التابعة",
      holding: "خبرات متعددة القطاعات",
      subs: {
        holding: {
          title: "سالي كابيتال القابضة",
          desc: "شركة قابضة تقود توجه المجموعة ورؤيتها التنموية.",
          btn: "لمعرفة المزيد"
        },
        commodities: {
          title: "سالي للسلع",
          desc: "شركة استيراد وتصدير، متخصصة في المنتجات الغذائية الفاخرة والمواد الخام الزراعية.",
          btn: "لمعرفة المزيد"
        },
        dassouli: {
          title: "فونسير الدسولي العقارية",
          desc: "شركة عقارية متخصصة في الاستثمار التأجيري في المحلات التجارية الراقية.",
          btn: "لمعرفة المزيد"
        },
        digicom: {
          title: "سالي ديجي كوم",
          desc: "وكالة تسويق واتصال رقمي.",
          btn: "لمعرفة المزيد"
        }
      }
    },
    contact: {
      title: "تواصل معنا",
      spanFuture: "",
      tag: "تواصل معنا",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      formTitle: "لديك مشروع؟ اكتب إلينا",
      formTitleCommodities: "هل أنت مهتم بأحد منتجاتنا؟ هل لديك منتجات لتعرضها علينا؟ اكتب إلينا",
      formTitleDassouli: "هل أنت مهتم؟ اطلب زيارة أو معلومات إضافية",
      fullName: "الاسم الكامل",
      emailLabel: "البريد الإلكتروني",
      phoneLabel: "رقم الهاتف",
      subjectLabel: "الموضوع",
      messageLabel: "الرسالة",
      companyLabel: "الشركة",
      roleLabel: "الملف الشخصي / الدور",
      conceptLabel: "الاسم التجاري",
      placeholderName: "اسمك الكريم...",
      placeholderEmail: "name@example.com",
      placeholderPhone: "رقم هاتفك",
      placeholderSubject: "كيف يمكننا مساعدتك؟",
      placeholderMessage: "كيف يمكننا مساعدتك؟",
      placeholderMessageCommodities: "كيف يمكننا مساعدتك؟",
      placeholderMessageDassouli: "كيف يمكننا مساعدتك؟",
      placeholderCompany: "شركتك الموقرة...",
      placeholderConcept: "علامتك التجارية",
      btnSend: "إرسال",
      btnSendCommodities: "إرسال المقترح الكلي",
      btnSendDassouli: "تقديم طلبي",
      successTitle: "تم الإرسال بنجاح!",
      successTitleDassouli: "تم استلام الطلب!",
      successDesc: "تم إرسال رسالتك بنجاح وتوجيهها إلى الإدارة الرئيسية للمجموعة: hd@sali-capital.com. سيقوم فريقنا بدراسة اقتراح الشراكة خلال 24 ساعة عمل.",
      successDescCommodities: "تم إرسال ملف الاهتمام بالسلع إلى المكتب التجاري الرئيسي: hd@sali-capital.com وسنتصل بك في غضون 24 ساعة.",
      successDescDassouli: "تم إرسال ملف الترشح بنجاح إلى مكتب إدارة الممتلكات العقارية: hd@sali-capital.com وسنقوم بدراسته والتواصل معك في أقرب وقت.",
      successDescDigicom: "تم إرسال طلب مشروعك الرقمي بنجاح إلى فريق سالي ديجي كوم: contact@sali-digicom.com. وسنتواصل معك في غضون 24 ساعة.",
      btnWriteAnother: "كتابة رسالة جديدة",
      btnWriteAnotherDassouli: "تقديم ملف ترشح آخر",
      commercialLease: "عقد إيجار تجاري 3/6/9",
      roles: {
        distributor: "موزع / مستورد",
        broker: "وسيط / وكيل تجاري",
        producer: "منتج / تعاونية زراعية",
        other: "فاعل آخر في القطاع"
      }
    },
    commodities: {
      importExportTag: "استيراد وتصدير",
      servicesTitle: "خدماتنا",
      servicesSubtitle: "",
      servicesDesc: "نحن ننظم من البداية إلى النهاية عمليات التوريد، واعتماد مطابقة الجودة، وشحن المكونات الغذائية الاستثنائية لشركائنا، بالاعتماد على شبكة إنتاج محلية مرنة ولوجستيات دولية معتمدة. نحن نضمن تنسيقًا سلسًا لتأمين إمداداتكم الإقليمية والعابرة للقارات.",
      coordinationTag: "استيراد وتصدير",
      coordTitle: "خدماتنا",
      coordSubtitle: "العلامة الخاصة",
      coordDesc: "نخلق قيمة لمنتجاتكم الحالية وعلامتكم التجارية. سواء كان ذلك عبر العلامة التجارية الخاصة، أو بعلامتكم التجارية القائمة، فإننا نعرض منتجاتكم للتصدير على شبكتنا ونتكفل بكامل السلسلة المؤدية إلى تصدير المنتج الخاص بكم.",
      terroirTag: "استيراد وتصدير",
      moroccoTitle: "منتجاتنا",
      moroccoSubtitle: "أصل المغرب",
      moroccoDesc: "نحن نبني شبكتنا من المنتجين المحليين على أساس الثقة المتبادلة وجودة منتجاتهم. إن التراب المغربي غني ومزارعونا يزرعون فواكه وخضروات وزيوت استثنائية تحترم البيئة ويتم نقلها في ظروف ملائمة للمنتج لضمان الجودة المثلى للمنتج المصدر عند وصوله إلى وجهته. قائمة المنتجات ليست حصرية ويمكننا، عبر شبكتنا، منحكم إمكانية الوصول إلى منتجات أخرى عند الطلب.",
      moroccoFooter: "",
      southSouthTag: "منتجات دولية",
      tropTitle: "منتجاتنا",
      tropSubtitle: "منتجات دولية",
      tropDesc: "من خلال شبكتنا من المنتجين في غرب إفريقيا، نوفر لكم الوصول إلى منتجات ذات جودة استثنائية بما في ذلك (قائمة غير حصرية): مكسرات الكاجو، البصل المجفف، والمانجو (الطازج، المجفف أو المجمد).",
      tropFooter: "",
      marketsTag: "استيراد وتصدير",
      marketsTitle: "أسواقنا",
      marketsSubtitle: "شبكة الاتصال",
      marketsDesc: "في تطور مستمر، تشمل شبكتنا الحالية مستوردين ومصدرين متواجدين في أوروبا وإفريقيا وكذلك في آسيا.",
      certifiedOrigin: "منشأ معتمد ومكفول",
      strictControl: "مراقبة صارمة ومعايير",
      selection: "انتقاء دقيق",
      services: {
        sourcing: {
          title: "التوريد وتأمين الإمدادات",
          p1: "تحديد وتقييم المنتجين المحليين المؤهلين بدقة",
          p2: "إنشاء مراكز شراء محلية مخصصة للعمليات",
          p3: "بناء شبكات قوية ومستدامة من المنتجين حسب الفئة",
          p4: "التفاوض الأمثل على شروط وأسعار الشراء لضمان التنافسية"
        },
        commercial: {
          title: "تطوير الأعمال والأسواق",
          p1: "ربط المنتجين المحليين بكبار المشترين العالميين",
          p2: "تمثيل تجاري متميز في الأسواق العالمية للتصدير",
          p3: "استهداف الأسواق الواعدة وتأهيل العملاء الأجانب",
          p4: "التوزيع المباشر لدى تجار الجملة وشبكات البيع الكبرى"
        },
        logistics: {
          title: "اللوجستيات والنقل الدولي",
          p1: "تنسيق متكامل لسلاسل الإمداد من المزرعة إلى ميناء الوصول",
          p2: "شراكات استراتيجية متينة مع كبرى الخطوط الملاحية والبرية",
          p3: "تسهيل وإنهاء المعاملات الجمركية وإجراءات المرور بسلاسة",
          p4: "التحكم الكامل والخبرة في شروط الشحن الدولية (Incoterms)"
        },
        quality: {
          title: "مراقبة الجودة والمطابقة",
          p1: "عمليات تدقيق وفحص دقيقة للجودة قبل عمليات الشحن",
          p2: "الحصول على شهادات الجودة العالمية (GlobalGAP, Bio, ISO)",
          p3: "ضمان الامتثال الصارم للوائح الاستيراد في أسواق المقصد",
          p4: "إجراء التحاليل الفيزيائية والكيميائية في مختبرات وطنية معتمدة"
        },
        storage: {
          title: "التخزين والتعبئة الصحية",
          p1: "النقل والتجميع الآمن في مستودعات تبريد وغرف معتمدة",
          p2: "عمليات الفرز والتدريج والتعبئة المخصصة حسب الطلب",
          p3: "تأمين مواد تعبئة وتغليف مستدامة ومطابقة لأرقى المعايير",
          p4: "الحفاظ التام على استمرارية سلسلة التبريد لضمان النضارة"
        },
        brand: {
          title: "تصميم العلامات الخاصة (White Label)",
          p1: "إنشاء وتطوير علامات تجارية مخصصة للموزعين والمحلات",
          p2: "تصميم هويات بصرية وعبوات مميزة ومبتكرة للمنتج",
          p3: "ترسيخ الموضع التسويقي للمنتج حسب تفضيلات البلدان",
          p4: "الموافقة الفنية والمطابقة لملصقات المنتجات مع القوانين"
        },
        admin: {
          title: "المكتب الإداري والتجاري",
          p1: "إعداد وتجهيز ملفات الاستيراد والتصدير الجمركية كاملة",
          p2: "المعالجة الصارمة لشهادات الصحة النباتية والرقابة الدولية",
          p3: "توفير حلول بنية مالية ومصرفية مستقرة لتمويل التجارة",
          p4: "إدارة المخاطر وتحوط تقلبات صرف العملات الأجنبية"
        },
        consulting: {
          title: "الاستشارات والاستراتيجية",
          p1: "دراسات تحليلية معمقة واستشرافية لتوجهات الأسواق",
          p2: "وضع استراتيجيات مخصصة للولوج وترسيخ الحضور التجاري",
          p3: "المراقبة المستمرة للتغيرات التنظيمية والتعريفات الجمركية",
          p4: "استشارات لتنويع سلال المنتجات الغذائية والابتكار فيها"
        },
        digital: {
          title: "الخدمات الرقمية والشفافية",
          p1: "تطوير كتالوجات رقمية مخصصة لكبار المشترين المحترفين",
          p2: "تعزيز حضور المنتجين على المنصات الرقمية العالمية (B2B)",
          p3: "توفير أدوات تتبع مسار الشحنات ومواقع السفن بدقة",
          p4: "بوابة إلكترونية آمنة للعملاء لمراجعة مستندات الشحن تزامناً"
        }
      },
      products: {
        citrus: {
          name: "الحمضيات المغربية",
          cat: "فواكه طازجة - المغرب",
          desc: "كلمنتين بركان، البرتقال بنوعيه نافيل وماروك ليت العطري واللذيذ، المشهور عالمياً بمذاقه السكري الرفيع."
        },
        tomatoes: {
          name: "طماطم مستديرة وكرزية",
          cat: "زراعة الخضراوات - المغرب",
          desc: "طماطم مزروعة في دفيئات حديثة في منطقة سوس ماسة، موجهة لتلبية متطلبات الجودة الصارمة في أوروبا."
        },
        berries: {
          name: "الفواكه الحمراء الممتازة",
          cat: "فواكه طازجة - المغرب",
          desc: "تشكيلة منتقاة من التوت البري، الفراولة والتمور الرائعة المزروعة بعناية في أودية الغرب واللوكوس."
        },
        oliveOil: {
          name: "زيت زيتون بكر ممتاز",
          cat: "منتجات محلية - المغرب",
          desc: "زيت بكر ممتاز من أشجار الزيتون 'البيشولين المغربية' التقليدية، غني بمضادات الأكسدة ومحصول بالطرق العريقة."
        },
        avocado: {
          name: "الأفوكادو المغربي",
          cat: "زراعة الخضراوات - المغرب",
          desc: "حبات أفوكادو هاس دسمة وفاخرة تم قطفها تحت أشعة شمس منطقة الغرب والجنوب وشحنها تحت معايير تبريد فائقة."
        },
        cashew: {
          name: "حبات الكاجو الفاخرة",
          cat: "فواكه جافة - أفريقيا",
          desc: "حبات كاجو خام ممتازة وعالية الجودة، منتقاة ومستوردة مباشرة من التعاونيات الزارعية ببلدان غرب أفريقيا."
        },
        mango: {
          name: "مانجو طازج",
          cat: "فواكه - أفريقيا",
          desc: "ثمار مانجو استثنائية، تم قطفها عند تمام النضج لضمان أفضل نكهة عطرية وكثافة ألياف وسكر مثالي."
        },
        driedMango: {
          name: "مانجو مجفف",
          cat: "وجبات خفيفة صحية",
          desc: "شرائح مانجو طرية مجففة طبيعياً بدون إضافة سكريات أو مواد كيميائية للحفاظ على جودتها الغذائية العالية."
        },
        mangoPuree: {
          name: "مهروس مانجو طبيعي",
          cat: "الصناعات الغذائية",
          desc: "لب مانجو طبيعي 100٪ مستخلص على البارد للحصول على غنى عطري ومذاق فاكهي ممتاز."
        },
        onion: {
          name: "بصل مجفف للصناعة",
          cat: "مكونات عطرية",
          desc: "قطع بصل فاخرة مجففة، أو مسحوق ناعم، تتميز برائحتها العطرية والغذائية الشديدة لقطاع الصناعات الغذائية."
        }
      },
    },
    digicom: {
      heroSubtitle: "وكالة التسويق والاتصال الرقمي",
      webTitle: "التصميم والتطوير",
      webDesc: "نصمم ونطور منصات ويب قوية، آمنة ومحسنة لمحركات البحث (SEO)، بهدف جذب زواركم وزيادة المبيعات والتحويلات.",
      brandingTitle: "هوية العلامة التجارية والتصميم",
      brandingDesc: "تجسيد هوية علامتكم التجارية من خلال تصاميم فريدة ومؤثرة تتماشى تمامًا مع قيمكم وتوجهاتكم الاستراتيجية.",
      marketingTitle: "الاستراتيجية والظهور",
      marketingDesc: "حسّن ظهورك على الإنترنت واستقطب عملاء محتملين من خلال استراتيجياتنا المدروسة للإعلان والتسويق الرقمي.",
      aiTitle: "الذكاء الاصطناعي والأتمتة",
      aiDesc: "دمج الابتكار في صميم أعمالكم. نطور حلول أتمتة مخصصة لزيادة إنتاجية فرق العمل وتقليل التكاليف وزيادة الربحية.",
      approachTitle: "طريقة عملنا",
      approachDesc: "يبدأ كل مشروع بالاستماع الدقيق لاحتياجاتكم. نمزج بين الإبداع الفني والدقة التقنية لتقديم تجارب رقمية استثنائية.",
      valuesTitle: "ركائزنا الأربع",
      valuesDesc: "يرتكز دعمنا لكم على قيم قوية تضمن نجاح تحولكم الرقمي وتحقيق أهدافكم.",
      reachTitle: "نطاق أعمالنا",
      reachDesc: "من المغرب، نرافق الشركات المحلية والدولية في مسيرتها الرقمية من خلال توفير أحدث تقنيات التسويق والذكاء الاصطناعي.",
      webServices: {
        landing: {
          title: "صفحة هبوط",
          desc: "صفحات هبوط عالية التحويل مخصصة لحملاتكم الإعلانية."
        },
        showcase: {
          title: "موقع تعريفي",
          desc: "عرض أنيق ومميز لأعمالكم ونشاطكم التجاري على الإنترنت بشكل عصري."
        },
        corporate: {
          title: "موقع شركات",
          desc: "بوابات مؤسسية راقية مصممة خصيصاً للمجموعات والشركات الكبرى."
        },
        ecommerce: {
          title: "موقع تجارة إلكترونية",
          desc: "متاجر إلكترونية متطورة تتميز بتجربة تسوق سلسة وآمنة."
        },
        maintenance: {
          title: "صيانة شهرية",
          desc: "متابعة تقنية مستمرة، تحديثات أمنية وتطوير مستمر للأداء."
        }
      },
      brandingServices: {
        logo: {
          title: "تصميم شعار",
          desc: "شعار مبتكر وفريد يعبر عن هوية علامتكم التجارية ويسهل تذكره."
        },
        charte: {
          title: "هوية بصرية كاملة",
          desc: "تحديد خطوط علامتكم التجارية وألوانها وقواعدها البصرية."
        },
        card: {
          title: "بطاقة عمل",
          desc: "بطاقات عمل ورقية واحترافية عالية الجودة للتواصل الفعال."
        },
        brochure: {
          title: "كتيبات وملفات تجارية",
          desc: "تصميم عروض وكتيبات تعريفية احترافية لشركائكم وعملائكم."
        }
      },
      marketingServices: {
        social: {
          title: "إدارة شبكات التواصل الاجتماعي",
          desc: "بناء استراتيجية المحتوى وإدارة وتنشيط المجتمعات الرقمية."
        },
        ads: {
          title: "حملات إعلانية ممولة (Meta Ads)",
          desc: "إعلانات مستهدفة وفعالة على فيسبوك، إنستغرام وواتساب لزيادة المبيعات."
        },
        audit: {
          title: "تدقيق رقمي وسيو (SEO)",
          desc: "تحليل كامل لحضوركم الرقمي وتحسين موقعكم لمحركات البحث."
        }
      },
      aiServices: {
        chatbot: {
          title: "مساعد مجيب ذكي (Web / WhatsApp)",
          desc: "وكيل ذكي متاح 24/7 للرد على العملاء وجمع الطلبات تلقائياً."
        },
        assistant: {
          title: "مساعد ذكاء اصطناعي مخصص",
          desc: "أدوات ذكاء اصطناعي مدربة خصيصاً على بيانات شركتكم الداخلية."
        },
        automation: {
          title: "أتمتة المبيعات والبريد الإلكتروني",
          desc: "تحسين وتسهيل سير العمل التجاري وإرسال رسائل المتابعة تلقائياً."
        },
        consulting: {
          title: "استشارات الذكاء الاصطناعي للمؤسسات",
          desc: "تدريب فرق العمل ودمج أدوات الذكاء الاصطناعي في بيئة العمل."
        }
      },
      valuesList: {
        strategy: {
          title: "الاستراتيجية",
          desc: "رؤية واضحة وأهداف محددة بدقة لكل مشروع تجاري."
        },
        creativity: {
          title: "الإبداع",
          desc: "أفكار أصيلة وتصاميم مميزة تضمن لكم التفوق عن منافسيكم."
        },
        performance: {
          title: "الأداء",
          desc: "تركيز مستمر على زيادة المبيعات وتحقيق العوائد من الاستثمار."
        },
        support: {
          title: "المواكبة",
          desc: "تعاون وثيق ومتابعة مستمرة لنمو أعمالكم خطوة بخطوة."
        }
      }
    },
    dassouli: {
      tag: "محلاتنا المتاحة للإيجار",
      title: "محل تجاري بمساحة 70 م²",
      titleSpan: "في الطابق الأول من بي تايم مول (المدينة الخضراء)",
      titleEnd: "",
      address: "الطابق الأول، بي تايم مول، المدينة الخضراء ببوسكورة",
      desc: "محل تجاري بمساحة 70 متر مربع يقع في الطابق الأول من مركز بي تايم مول في بوسكورة المدينة الخضراء. موقع مثالي لمختلف الأنشطة التجارية أو الخدمية أو المطاعم، حيث يستفيد المحل من موقع استراتيجي وتدفق مستمر للزوار. للمزيد من المعلومات حول المحل، يرجى الاتصال بنا",
      specs: {
        areaLabel: "المساحة الإجمالية:",
        areaValue: "70 م²",
        mallLabel: "بي تايم مول:",
        mallValue: "المدينة الخضراء بوسكورة",
        leaseLabel: "نوع العقد الإيجاري:",
        leaseValue: "عقد إيجار تجاري 3/6/9",
        servicesLabel: "مواصفات وتجهيزات:",
        servicesValue: "جاهز بمنافذ سحب السوائل وفوهات التهوية"
      },
      btnCandidacy: "إشعار بالاهتمام",
      availability: "جاهز للتسليم الفوري",
      sideTitle: "إدارة المحافظ العقارية",
      sideSubtitle: "تثمين المواقع والممتلكات العقارية",
      sideDesc: "نحن نختار مواقع استراتيجية ذات قيمة تأجيرية واعدة لتكون موطناً لمختلف العلامات التجارية والخدمية والمطاعم.",
      sideFooter: "مجمع بي تايم مول Bouskoura",
      galleryTag: "معرض صور المحل",
      galleryTitle: "مساحات و",
      gallerySubtitle: "تصاميم وتخطيط",
      galleryDesc: "تصفح الصور الحقيقية للمجمع واكتشف نماذج تخطيط وتصميم المحل بناءً على أبعاده الحقيقية.",
      photos: {
        p1: {
          title: "المنظر الخارجي 1 - بي تايم مول",
          desc: "المنظر الخارجي 1 - بي تايم مول."
        },
        p2: {
          title: "المنظر الخارجي 2 - بي تايم مول",
          desc: "المنظر الخارجي 2 - بي تايم مول."
        },
        p3: {
          title: "المجسم الداخلي ثلاثي الأبعاد 1",
          desc: "نموذج لتصميم وتخطيط المحل كمقهى عصائر (Juice Bar)."
        },
        p4: {
          title: "المجسم الداخلي ثلاثي الأبعاد 2",
          desc: "نموذج لتصميم وتخطيط المحل كمعرض أثاث وديكور."
        }
      }
    }
  }
};
