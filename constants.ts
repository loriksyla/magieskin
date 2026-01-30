import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Magie Renewal Serum',
    shortName: 'The Serum',
    price: 125,
    description: 'A potent bio-active concentrate designed to accelerate cellular turnover and restore skin elasticity. The magic of youth in a bottle.',
    benefits: ['Reduces fine lines', 'Boosts collagen', 'Deep hydration'],
    ingredients: ['Epidermal Growth Factor', 'Hyaluronic Acid', 'Peptides'],
    imageUrl: 'https://picsum.photos/id/1/800/1000', // Placeholder
    size: '30ml / 1.0 fl oz'
  },
  {
    id: 'p2',
    name: 'Magie Radiance Cream',
    shortName: 'The Cream',
    price: 85,
    description: 'A rich, biomimetic lipid complex that repairs the skin barrier and locks in moisture for 24 hours. Reveal your inner glow.',
    benefits: ['Repairs skin barrier', 'Sooths inflammation', 'Intense moisture'],
    ingredients: ['Ceramides', 'Squalane', 'Niacinamide'],
    imageUrl: 'https://picsum.photos/id/2/800/1000', // Placeholder
    size: '50ml / 1.7 fl oz'
  },
  {
    id: 'p3',
    name: 'Magie Crystal Essence',
    shortName: 'The Essence',
    price: 65,
    description: 'A gentle exfoliating toner that refines texture and prepares the skin for maximum absorption. Crystal clear perfection.',
    benefits: ['Exfoliates gently', 'Brightens tone', 'Minimizes pores'],
    ingredients: ['Fruit Enzymes', 'PHA', 'Aloe Vera'],
    imageUrl: 'https://picsum.photos/id/3/800/1000', // Placeholder
    size: '100ml / 3.4 fl oz'
  }
];

export const SYSTEM_INSTRUCTION = `You are the Magie Skin AI Consultant, an expert for a luxury skincare brand called Magie Skin. 
We only sell 3 distinct products:
1. Magie Renewal Serum ($125) - For anti-aging and renewal.
2. Magie Radiance Cream ($85) - For hydration and repair.
3. Magie Crystal Essence ($65) - For gentle exfoliation and brightening.

Your goal is to help customers choose the right product based on their skin concerns (dryness, aging, dullness, etc.).
Keep answers concise, elegant, and helpful. Do not mention other brands. If asked about ingredients, explain their benefits simply.
Always maintain a sophisticated, scientific, yet slightly magical and enchanting tone suitable for "Magie Skin".`;