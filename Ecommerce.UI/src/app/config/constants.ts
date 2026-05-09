/**
 * Global Application Constants
 */
export interface Category {
  name: string;
  slug: string;
}

export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api'
};

export const APP_CONSTANTS: {
  WHATSAPP_PHONE_NUMBER: string;
  PHONE_NUMBER_DISPLAY: string;
  PHONE_NUMBER_TEL: string;
  EMAIL: string;
  ADDRESS: string;
  CATEGORIES: Category[];
} = {
  WHATSAPP_PHONE_NUMBER: '918460315245',
  PHONE_NUMBER_DISPLAY: '+91 84603 15245',
  PHONE_NUMBER_TEL: '+918460315245',
  EMAIL: 'info.balluart@gmail.com',
  ADDRESS: 'Surendranagar, Gujarat, India',

  CATEGORIES: [
    { name: 'All Products', slug: 'all' },
    { name: 'Tile Adhesives', slug: 'tile-adhesives' },
    { name: 'Waterproofing Solutions', slug: 'waterproofing-solutions' },
    { name: 'White Cement', slug: 'white-cement' },
    { name: 'Construction Chemicals', slug: 'construction-chemicals' },
    { name: 'Surface Repair Solutions', slug: 'surface-repair-solutions' },
    { name: 'Bonding Agents & Additives', slug: 'bonding-agents-additives' },
    { name: 'Grouts & Fillers', slug: 'grouts-fillers' },
    { name: 'Stone & Marble Solutions', slug: 'stone-marble-solutions' }
  ]
};
