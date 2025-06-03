export interface Location {
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  radius: number;
}

export interface PropertyDetails {
  price: number;
  downPayment: number;
  downPaymentPercent: number;
  loanAmount: number;
  creditScore: number;
  loanTerm: number;
  interestRate: number;
  propertyType: 'single-family' | 'condo' | 'townhouse' | 'multi-family';
  occupancy: 'primary' | 'secondary' | 'investment';
  isVeteran: boolean;
  isFirstTimeBuyer: boolean;
  hoaFees: number;
  moveInDate?: Date;
  customTaxRate?: number;
  includeUtilities: boolean;
  squareFeet?: number;
}

export interface TaxAndInsurance {
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  hoaFees: number;
}

export interface MortgagePayment {
  principal: number;
  interest: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  hoaFees: number;
  utilities?: number;
  total: number;
}

export interface AmortizationSchedule {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface MortgageState {
  location: Location;
  propertyDetails: PropertyDetails;
  taxAndInsurance: TaxAndInsurance;
  payment: MortgagePayment;
  amortizationSchedule: AmortizationSchedule[];
}