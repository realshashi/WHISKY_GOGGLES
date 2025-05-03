export interface Bottle {
  id: number;
  name: string;
  size: number;
  proof: number | null;
  abv: number;
  spirit_type: string;
  brand_id: number;
  popularity: number;
  image_url: string;
  avg_msrp: number;
  fair_price: number;
  shelf_price: number;
  total_score: number;
  wishlist_count: number;
  vote_count: number;
  bar_count: number;
  ranking: number;
}

export interface BottleMatch {
  bottle: Bottle;
  confidence: number;
}

export interface ScanResult {
  topMatch: BottleMatch | null;
  alternativeMatches: BottleMatch[];
  noMatches: boolean;
}

export interface SavedScan {
  id: string;
  timestamp: number;
  bottleId: number;
  storePrice?: number;
  location?: string;
}

export type ActiveTab = 'scan' | 'search' | 'history' | 'settings';
