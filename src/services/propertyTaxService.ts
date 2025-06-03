/**
 * Service to fetch property tax rates by location
 * Using api-ninjas.com property tax API for real data
 */
import { getApiKey } from './apiConfig';
import { validateZipCode, sanitizeString, apiRateLimiter } from '../utils/validation';

export interface TaxRateResult {
  taxRate: number; // Tax rate as a percentage (e.g., 1.05 means 1.05%)
  state: string;
  county: string;
}

// API rate limits and pricing (as of June 2025):
// - Free tier: 10,000 API calls per month
// - Response format: JSON containing property tax rate for the specified ZIP code
// - Documentation: https://api-ninjas.com/api/propertytax

// Sample tax rates by ZIP code (fallback mock data if API fails)
// This will only be used if the API call fails
const taxRatesByZipCode: Record<string, number> = {
  '90001': 1.16, // Los Angeles, CA
  '90210': 1.25, // Beverly Hills, CA
  '10001': 1.93, // Manhattan, NY
  '60601': 2.27, // Chicago, IL
  '33101': 1.02, // Miami, FL
  '98101': 0.92, // Seattle, WA
  '78701': 2.11, // Austin, TX
  '02108': 1.19, // Boston, MA
  '20001': 0.85, // Washington DC
  '80202': 0.71, // Denver, CO
  '85001': 0.68, // Phoenix, AZ
  '97201': 1.07, // Portland, OR
  '27601': 0.86, // Raleigh, NC
  '30301': 1.06, // Atlanta, GA
  '55401': 1.43, // Minneapolis, MN
};

// Tax rates by state (fallback)
const taxRatesByState: Record<string, number> = {
  'AL': 0.41, // Alabama
  'AK': 1.19, // Alaska
  'AZ': 0.62, // Arizona
  'AR': 0.62, // Arkansas
  'CA': 0.76, // California
  'CO': 0.51, // Colorado
  'CT': 1.73, // Connecticut
  'DE': 0.57, // Delaware
  'FL': 0.89, // Florida
  'GA': 0.92, // Georgia
  'HI': 0.28, // Hawaii
  'ID': 0.69, // Idaho
  'IL': 2.27, // Illinois
  'IN': 0.85, // Indiana
  'IA': 1.53, // Iowa
  'KS': 1.41, // Kansas
  'KY': 0.86, // Kentucky
  'LA': 0.55, // Louisiana
  'ME': 1.30, // Maine
  'MD': 1.09, // Maryland
  'MA': 1.23, // Massachusetts
  'MI': 1.54, // Michigan
  'MN': 1.12, // Minnesota
  'MS': 0.65, // Mississippi
  'MO': 0.97, // Missouri
  'MT': 0.84, // Montana
  'NE': 1.73, // Nebraska
  'NV': 0.60, // Nevada
  'NH': 2.18, // New Hampshire
  'NJ': 2.49, // New Jersey
  'NM': 0.55, // New Mexico
  'NY': 1.40, // New York
  'NC': 0.84, // North Carolina
  'ND': 0.98, // North Dakota
  'OH': 1.56, // Ohio
  'OK': 0.87, // Oklahoma
  'OR': 0.97, // Oregon
  'PA': 1.58, // Pennsylvania
  'RI': 1.53, // Rhode Island
  'SC': 0.57, // South Carolina
  'SD': 1.32, // South Dakota
  'TN': 0.71, // Tennessee
  'TX': 1.80, // Texas
  'UT': 0.66, // Utah
  'VT': 1.90, // Vermont
  'VA': 0.80, // Virginia
  'WA': 0.98, // Washington
  'WV': 0.58, // West Virginia
  'WI': 1.85, // Wisconsin
  'WY': 0.61, // Wyoming
  'DC': 0.85, // Washington DC (not a state but included)
};

// Function to extract ZIP code from an address string with validation
const extractZipCode = (address: string): string | null => {
  // Sanitize the input first
  const cleanAddress = sanitizeString(address);
  
  // Simple regex to find 5-digit ZIP codes in address string
  const zipMatch = cleanAddress.match(/\b\d{5}\b/);
  const zip = zipMatch ? zipMatch[0] : null;
  
  // Validate the ZIP code format
  if (zip && validateZipCode(zip)) {
    return zip;
  }
  
  return null;
};

// Function to extract state from an address string
const extractState = (address: string): string | null => {
  // Array of US state abbreviations
  const stateAbbreviations = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'];
  
  // Create a regex pattern to match state abbreviations that are not part of other words
  const stateRegexPattern = new RegExp(`\\b(${stateAbbreviations.join('|')})\\b`);
  const stateMatch = address.match(stateRegexPattern);
  
  return stateMatch ? stateMatch[0] : null;
};

// Interface for API response from api-ninjas
interface ApiNinjasPropertyTaxResponse {
  state: string;
  county: string;
  city: string;
  zip: string;
  property_tax_25th_percentile: number;
  property_tax_50th_percentile: number;
  property_tax_75th_percentile: number;
}

// Fetch property tax rate based on location
export const getPropertyTaxRate = async (address: string): Promise<TaxRateResult> => {
  // Sanitize input address
  const cleanAddress = sanitizeString(address);
  
  // Try to extract ZIP code from the address
  const zipCode = extractZipCode(cleanAddress);
  
  // If we have a ZIP code, try to get data from API Ninjas
  if (zipCode) {
    try {
      // Get API key from storage
      const apiKey = getApiKey('ninjas');
      
      // Make API call to api-ninjas.com if API key is available and rate limit not exceeded
      if (apiKey && apiRateLimiter.canMakeRequest('property-tax-api')) {
        // Using the correct parameter: "zip" instead of "zip_code"
        const response = await fetch(`https://api.api-ninjas.com/v1/propertytax?zip=${zipCode}`, {
          method: 'GET',
          headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          // The API returns an array of objects
          const data: ApiNinjasPropertyTaxResponse[] = await response.json();
          
          // Check if we got any results
          if (data && data.length > 0) {            // Use the median (50th percentile) rate and convert to percentage format
            // API returns decimal (e.g., 0.0104 means 1.04%)
            const taxRate = data[0].property_tax_50th_percentile * 100;
            
            return {
              taxRate: taxRate,
              state: data[0].state,
              county: data[0].county
            };          } else {
            // API returned no results - using fallback data
          }        } else {
          // API returned error status - using fallback data
        }      } else {
        // No API key found - using fallback data
      }    } catch (error) {
      // Error fetching property tax data - using fallback data
    }
  }
  
  // Use fallback data if API call fails or no ZIP code found
  // Try to use ZIP code data
  if (zipCode && taxRatesByZipCode[zipCode]) {
    return {
      taxRate: taxRatesByZipCode[zipCode],
      state: 'Unknown',
      county: 'Unknown'
    };
  }
  
  // If no ZIP code found or not in our database, try to extract state
  const state = extractState(address);
  if (state && taxRatesByState[state]) {
    return {
      taxRate: taxRatesByState[state],
      state: state,
      county: 'Unknown'
    };
  }
  
  // If all else fails, return a default national average
  return {
    taxRate: 1.07, // National average property tax rate
    state: 'Unknown',
    county: 'Unknown'
  };
};
