export type RoastLevel = 'LIGHT' | 'MEDIUM' | 'DARK';

export interface TastingNote {
  name: string;
  category: 'Floral' | 'Fruity' | 'Sweet' | 'Nutty' | 'Spiced' | 'Roasty';
  intensity: number; // 1-100
}

export interface CoffeeProduct {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  roastLevel: RoastLevel;
  roastProfile: string;
  elevation: string;
  origin: string;
  region: string;
  varietal: string;
  process: string;
  tastingNotes: string[];
  sensoryScores: {
    acidity: number;
    sweetness: number;
    body: number;
    aroma: number;
    aftertaste: number;
  };
  flavorDescriptors: TastingNote[];
  price: number;
  badge: string;
  primaryColor: string;
  secondaryColor: string;
  bagColor: string;
  labelColor: string;
  accentColor: string;
  foilColor: string;
  story: string;
  recommendedBrew: string;
  harvestDate: string;
  batchNumber: string;
}

export interface StoryChapter {
  number: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  description: string;
  quote: string;
  stats: {
    label: string;
    value: string;
    detail: string;
  }[];
  visualTag: string;
  accentColor: string;
}

export interface CartItem {
  id: string;
  product: CoffeeProduct;
  grind: string;
  size: string;
  quantity: number;
  pricePerUnit: number;
  isSubscription: boolean;
  frequency?: string;
}
