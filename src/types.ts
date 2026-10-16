export interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  materials: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'scandinavian' | 'loft' | 'minimalism' | 'classic';
  categoryLabel: string;
  area: number;
  duration: string;
  cost: string;
  location: string;
  mainImage: string;
  gallery: string[];
  description: string;
  highlights: string[];
  beforeImage?: string;
  afterImage?: string;
}

export interface PriceTier {
  id: string;
  title: string;
  pricePerMeter: number;
  badge?: string;
  isPopular?: boolean;
  description: string;
  features: string[];
  materialsIncluded: string;
}

export interface LeadFormData {
  name: string;
  phone: string;
  repairType: string;
  area: number;
  message: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}
