/**
 * Service to fetch current mortgage interest rates
 */

interface RateData {
  rate: number;
  apr: number;
}

interface InterestRates {
  thirtyYearFixed: Record<string, RateData>;
  twentyYearFixed: Record<string, RateData>;
  fifteenYearFixed: Record<string, RateData>;
}

// This simulates an API call to get current mortgage rates
// In a real application, this would be replaced with an actual API call
export const fetchCurrentInterestRates = async (): Promise<InterestRates> => {
  // This is mock data - in a real app, you would fetch this from a real API
  // Rates are organized by credit score range
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        thirtyYearFixed: {
          "760+": { rate: 6.125, apr: 6.243 },
          "740-759": { rate: 6.325, apr: 6.443 },
          "720-739": { rate: 6.500, apr: 6.618 },
          "700-719": { rate: 6.688, apr: 6.806 },
          "680-699": { rate: 6.875, apr: 6.995 },
          "660-679": { rate: 7.125, apr: 7.245 },
          "640-659": { rate: 7.500, apr: 7.622 },
          "620-639": { rate: 8.000, apr: 8.124 }
        },
        twentyYearFixed: {
          "760+": { rate: 6.000, apr: 6.118 },
          "740-759": { rate: 6.125, apr: 6.243 },
          "720-739": { rate: 6.250, apr: 6.368 },
          "700-719": { rate: 6.438, apr: 6.556 },
          "680-699": { rate: 6.625, apr: 6.745 },
          "660-679": { rate: 6.875, apr: 6.995 },
          "640-659": { rate: 7.250, apr: 7.372 },
          "620-639": { rate: 7.750, apr: 7.874 }
        },
        fifteenYearFixed: {
          "760+": { rate: 5.500, apr: 5.618 },
          "740-759": { rate: 5.625, apr: 5.743 },
          "720-739": { rate: 5.750, apr: 5.868 },
          "700-719": { rate: 5.938, apr: 6.056 },
          "680-699": { rate: 6.125, apr: 6.245 },
          "660-679": { rate: 6.375, apr: 6.495 },
          "640-659": { rate: 6.750, apr: 6.872 },
          "620-639": { rate: 7.250, apr: 7.374 }
        }
      });
    }, 500); // Simulate network delay
  });
};

// Helper to get the credit score range key
export const getCreditScoreRange = (score: number): string => {
  if (score >= 760) return "760+";
  if (score >= 740) return "740-759";
  if (score >= 720) return "720-739";
  if (score >= 700) return "700-719";
  if (score >= 680) return "680-699";
  if (score >= 660) return "660-679";
  if (score >= 640) return "640-659";
  if (score >= 620) return "620-639";
  return "620-639"; // Default to lowest range if below 620
};

// Get the appropriate interest rate based on credit score and loan term
export const getInterestRateForCreditScore = async (creditScore: number, loanTerm: number): Promise<number> => {
  const rates = await fetchCurrentInterestRates();
  const scoreRange = getCreditScoreRange(creditScore);
  
  if (loanTerm === 30) {
    return rates.thirtyYearFixed[scoreRange].rate;
  } else if (loanTerm === 20) {
    return rates.twentyYearFixed[scoreRange].rate;
  } else if (loanTerm === 15) {
    return rates.fifteenYearFixed[scoreRange].rate;
  }
  
  // Default fallback
  return rates.thirtyYearFixed[scoreRange].rate;
};
