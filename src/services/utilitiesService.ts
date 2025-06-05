/**
 * Service to provide utility cost estimates by state
 * Includes electricity, water, gas, trash, internet, etc.
 */

import { getLocationUtilitiesCost } from './locationUtilitiesService';

// Average monthly utility costs by state (as of June 2025)
// Data in USD per month for an average household
const utilityCostsByState: Record<string, number> = {
  'AL': 422, // Alabama
  'AK': 507, // Alaska
  'AZ': 410, // Arizona
  'AR': 389, // Arkansas
  'CA': 465, // California
  'CO': 371, // Colorado
  'CT': 430, // Connecticut
  'DE': 411, // Delaware
  'FL': 459, // Florida
  'GA': 391, // Georgia
  'HI': 587, // Hawaii
  'ID': 338, // Idaho
  'IL': 345, // Illinois
  'IN': 352, // Indiana
  'IA': 343, // Iowa
  'KS': 364, // Kansas
  'KY': 378, // Kentucky
  'LA': 411, // Louisiana
  'ME': 392, // Maine
  'MD': 411, // Maryland
  'MA': 428, // Massachusetts
  'MI': 370, // Michigan
  'MN': 357, // Minnesota
  'MS': 387, // Mississippi
  'MO': 361, // Missouri
  'MT': 348, // Montana
  'NE': 353, // Nebraska
  'NV': 403, // Nevada
  'NH': 422, // New Hampshire
  'NJ': 431, // New Jersey
  'NM': 358, // New Mexico
  'NY': 435, // New York
  'NC': 365, // North Carolina
  'ND': 352, // North Dakota
  'OH': 348, // Ohio
  'OK': 359, // Oklahoma
  'OR': 367, // Oregon
  'PA': 396, // Pennsylvania
  'RI': 420, // Rhode Island
  'SC': 380, // South Carolina
  'SD': 344, // South Dakota
  'TN': 366, // Tennessee
  'TX': 430, // Texas
  'UT': 348, // Utah
  'VT': 412, // Vermont
  'VA': 380, // Virginia
  'WA': 343, // Washington
  'WV': 364, // West Virginia
  'WI': 349, // Wisconsin
  'WY': 355, // Wyoming
  'DC': 408  // Washington DC
};

// National average as fallback
const nationalAverageUtilityCost = 395;

/**
 * Get average monthly utility costs by state
 * @param state - Two-letter state code
 * @returns Monthly utility cost estimate in USD
 */
export const getUtilityCostByState = (state: string): number => {
  // Convert state code to uppercase for comparison
  const stateUpper = state.toUpperCase();
  
  // Return state-specific cost if available, otherwise return national average
  return utilityCostsByState[stateUpper] || nationalAverageUtilityCost;
};

/**
 * Calculate utility cost based on home size
 * @param baseCost - Base utility cost for average home
 * @param squareFeet - Home size in square feet
 * @returns Adjusted monthly utility cost estimate in USD
 */
export const adjustUtilityCostByHomeSize = (baseCost: number, squareFeet: number = 2000): number => {
  // Average US home size is ~2,000 sq ft, use that as baseline
  const averageHomeSize = 2000;
  
  // Simple scaling factor: costs increase with square footage but not linearly
  const scaleFactor = Math.pow(squareFeet / averageHomeSize, 0.7);
  
  return baseCost * scaleFactor;
};

/**
 * Get utility cost estimate based on state and home size
 * @param state - Two-letter state code
 * @param squareFeet - Home size in square feet (optional)
 * @returns Monthly utility cost estimate in USD
 */
export const estimateUtilityCost = (state: string, squareFeet?: number): number => {
  const baseCost = getUtilityCostByState(state);
  
  if (squareFeet) {
    return adjustUtilityCostByHomeSize(baseCost, squareFeet);
  }
  
  return baseCost;
};

/**
 * Enhanced utility cost estimation using location string
 * @param locationString - Can be ZIP code, "City, State", state code, or full address
 * @param squareFeet - Home size in square feet (optional)
 * @returns Monthly utility cost estimate in USD
 */
export const estimateUtilityCostByLocation = (locationString: string, squareFeet?: number): {
  cost: number;
  breakdown?: {
    electricity: number;
    gas: number;
    water: number;
    internet: number;
    trash: number;
  };
  source: string;
  location: string;
} => {
  console.log(`[utilitiesService] Estimating utilities for location: "${locationString}"`);
  const result = getLocationUtilitiesCost(locationString, squareFeet);
  console.log(`[utilitiesService] Result: $${result.monthlyCost} (${result.source})`);
  
  return {
    cost: result.monthlyCost,
    breakdown: result.breakdown,
    source: result.source,
    location: result.location
  };
};
