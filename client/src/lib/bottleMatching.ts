import { Bottle, BottleMatch } from '@/types';

// Cache for bottles data
let bottlesCache: Bottle[] | null = null;

// Fetch all bottles from the API
const fetchBottles = async (): Promise<Bottle[]> => {
  if (bottlesCache) return bottlesCache;
  
  const response = await fetch('/api/bottles');
  if (!response.ok) {
    throw new Error('Failed to fetch bottles');
  }
  
  bottlesCache = await response.json();
  return bottlesCache;
};

// Calculate similarity score between image features and bottle
const calculateSimilarity = (imageFeatures: number[], bottleFeatures: number[]): number => {
  // In a real implementation, this would use sophisticated matching algorithms
  // This is a simplified version for demonstration
  
  // For demo purposes, we'll generate a random score based on some properties of the bottle
  // In reality, you would compare visual features of the image with known features of bottles
  
  // Random number but deterministic for the same bottle (using bottle id as seed)
  const seed = bottleFeatures.reduce((acc, val) => acc + val, 0);
  const random = Math.sin(seed) * 10000;
  const baseScore = 50 + Math.abs(random % 50); // Score between 50-100
  
  return baseScore;
};

// Extract features from a bottle (for matching purposes)
const extractBottleFeatures = (bottle: Bottle): number[] => {
  // In a real implementation, these would be pre-computed visual features
  // For demonstration, we'll use bottle properties as "features"
  return [
    bottle.id,
    bottle.brand_id,
    bottle.popularity / 1000,
    bottle.spirit_type === 'Bourbon' ? 1 : 0,
    bottle.ranking / 100,
  ];
};

// Match image features against bottles
export const matchImageToBottles = async (imageFeatures: number[]): Promise<BottleMatch[]> => {
  const bottles = await fetchBottles();
  
  // Calculate similarity for each bottle
  const matches = bottles.map(bottle => {
    const bottleFeatures = extractBottleFeatures(bottle);
    const confidence = calculateSimilarity(imageFeatures, bottleFeatures);
    
    return {
      bottle,
      confidence
    };
  });
  
  // Sort by confidence (highest first)
  return matches.sort((a, b) => b.confidence - a.confidence);
};

// Search bottles by name
export const searchBottlesByName = async (query: string): Promise<Bottle[]> => {
  const bottles = await fetchBottles();
  
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  return bottles.filter(bottle => 
    bottle.name.toLowerCase().includes(lowerQuery) ||
    (bottle.spirit_type && bottle.spirit_type.toLowerCase().includes(lowerQuery))
  );
};
