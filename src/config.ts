import { Language, translations } from './translations';
export type PageKey = 'main' | 'commodities' | 'dassouli' | 'digicom';

export const PAGES_CONFIG: Record<PageKey, { sections: string[] }> = {
  main: {
    sections: ['hero', 'about', 'expertise', 'contact']
  },
  commodities: {
    sections: [
      'commodities-presentation',
      'commodities-services-1a',
      'commodities-services-1b',
      'commodities-services-2a',
      'commodities-services-2b',
      'commodities-products-1',
      'commodities-products-2',
      'commodities-markets',
      'commodities-contact'
    ]
  },
  dassouli: {
    sections: ['dassouli-accueil', 'dassouli-biens', 'dassouli-contact']
  },
  digicom: {
    sections: [
      'digicom-presentation',
      'digicom-services-1a',
      'digicom-services-1b',
      'digicom-services-2a',
      'digicom-services-2b',
      'digicom-products-1',
      'digicom-products-2',
      'digicom-contact'
    ]
  }
};
