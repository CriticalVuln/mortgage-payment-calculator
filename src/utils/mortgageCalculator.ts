import { PropertyDetails, MortgagePayment, AmortizationSchedule, TaxAndInsurance } from '../types/mortgage';

/**
 * Calculate the monthly principal and interest payment
 */
export const calculatePrincipalAndInterest = (loanAmount: number, interestRate: number, loanTerm: number): number => {
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  
  // Handle edge case of 0% interest rate
  if (interestRate === 0) {
    return loanAmount / numberOfPayments;
  }
  
  return loanAmount * (
    monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)
  ) / (
    Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1
  );
};

/**
 * Calculate PMI (Private Mortgage Insurance)
 */
export const calculatePMI = (propertyDetails: PropertyDetails): number => {
  const { downPaymentPercent, loanAmount, creditScore } = propertyDetails;
  
  // PMI is typically required when down payment is less than 20%
  if (downPaymentPercent >= 20) {
    return 0;
  }
  
  // Basic PMI calculation based on loan amount and credit score
  // In reality, this would be more complex and based on actual lender data
  let pmiRate = 0.01; // 1% annual default
  
  // Adjust PMI rate based on credit score
  if (creditScore >= 760) {
    pmiRate = 0.003; // 0.3%
  } else if (creditScore >= 740) {
    pmiRate = 0.005; // 0.5%
  } else if (creditScore >= 720) {
    pmiRate = 0.006; // 0.6%
  } else if (creditScore >= 700) {
    pmiRate = 0.007; // 0.7%
  } else if (creditScore >= 680) {
    pmiRate = 0.008; // 0.8%
  } else if (creditScore >= 660) {
    pmiRate = 0.009; // 0.9%
  } else {
    pmiRate = 0.01; // 1%
  }
  
  // Calculate annual PMI and convert to monthly
  return (loanAmount * pmiRate) / 12;
};

/**
 * Calculate property tax based on home value
 * Note: This is a simplified calculation. Real property taxes vary widely by location.
 */
export const calculatePropertyTax = (price: number, taxRate: number = 1.1): number => {
  // Default tax rate is 1.1% if not provided
  const annualPropertyTax = price * (taxRate / 100);
  return annualPropertyTax / 12;
};

/**
 * Calculate home insurance based on home value
 * Note: This is a simplified calculation. Actual insurance rates vary by many factors.
 */
export const calculateHomeInsurance = (price: number): number => {
  // Basic annual insurance rate of $3.50 per $1,000 of home value
  const annualInsurance = price * 0.0035;
  return annualInsurance / 12;
};

/**
 * Calculate full mortgage payment including all components
 */
import { estimateUtilityCost } from '../services/utilitiesService';

export const calculateMortgagePayment = (
  propertyDetails: PropertyDetails,
  taxAndInsurance: TaxAndInsurance,
  location?: { state?: string }
): MortgagePayment => {
  const { loanAmount, interestRate, loanTerm, hoaFees, includeUtilities, squareFeet } = propertyDetails;
  const { propertyTax, homeInsurance, pmi } = taxAndInsurance;
  
  const principalAndInterest = calculatePrincipalAndInterest(loanAmount, interestRate, loanTerm);
  const principal = principalAndInterest;
  const interest = interestRate > 0 ? principalAndInterest - (loanAmount / (loanTerm * 12)) : 0;
  
  // Get utilities cost if enabled
  let utilities: number | undefined;
  if (includeUtilities) {
    // Use location state if provided, otherwise default to Michigan
    const state = location?.state || 'MI';
    utilities = estimateUtilityCost(state, squareFeet);
  }
  
  // Calculate total with or without utilities
  const total = principal + propertyTax + homeInsurance + pmi + hoaFees + (utilities || 0);
  
  return {
    principal,
    interest,
    propertyTax,
    homeInsurance,
    pmi,
    hoaFees,
    utilities,
    total
  };
};

/**
 * Generate amortization schedule for the loan
 */
export const generateAmortizationSchedule = (
  loanAmount: number,
  interestRate: number,
  loanTerm: number,
  maxEntries: number = 12 * loanTerm
): AmortizationSchedule[] => {
  const monthlyInterestRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment = calculatePrincipalAndInterest(loanAmount, interestRate, loanTerm);
  
  const schedule: AmortizationSchedule[] = [];
  let remainingBalance = loanAmount;
  
  for (let month = 1; month <= Math.min(maxEntries, numberOfPayments); month++) {
    // Handle edge case of 0% interest rate
    let interestPayment = 0;
    if (interestRate > 0) {
      interestPayment = remainingBalance * monthlyInterestRate;
    }
    
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance -= principalPayment;
    
    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, remainingBalance) // Ensure balance doesn't go below 0 due to rounding
    });
  }
  
  return schedule;
};

/**
 * Calculate taxes and insurance based on property details
 */
export const calculateTaxAndInsurance = (propertyDetails: PropertyDetails): TaxAndInsurance => {
  const { price, hoaFees, customTaxRate } = propertyDetails;
  
  // Use custom tax rate if available, otherwise use default
  const propertyTax = customTaxRate 
    ? calculatePropertyTax(price, customTaxRate) 
    : calculatePropertyTax(price);
    
  const homeInsurance = calculateHomeInsurance(price);
  const pmi = calculatePMI(propertyDetails);
  
  return {
    propertyTax,
    homeInsurance,
    pmi,
    hoaFees
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format percentage for display
 */
export const formatPercentage = (percentage: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(percentage / 100);
};