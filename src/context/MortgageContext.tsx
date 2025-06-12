import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { 
  MortgageState, 
  Location, 
  PropertyDetails, 
  TaxAndInsurance, 
  MortgagePayment,
  AmortizationSchedule
} from '../types/mortgage';
import { 
  calculateTaxAndInsurance,
  calculateMortgagePayment,
  generateAmortizationSchedule
} from '../utils/mortgageCalculator';

// Initial state
const initialLocation: Location = {
  address: '',
  radius: 5
};

const initialPropertyDetails: PropertyDetails = {
  price: 400000,
  downPayment: 80000,
  downPaymentPercent: 20,
  loanAmount: 320000,
  creditScore: 740,
  loanTerm: 30,
  interestRate: 6.5,  propertyType: 'single-family',
  occupancy: 'primary',
  hoaFees: 0,
  customTaxRate: undefined,
  includeUtilities: false,
  squareFeet: 2000
};

const initialTaxAndInsurance: TaxAndInsurance = calculateTaxAndInsurance(initialPropertyDetails);

const initialPayment: MortgagePayment = calculateMortgagePayment(initialPropertyDetails, initialTaxAndInsurance, initialLocation);

const initialAmortizationSchedule: AmortizationSchedule[] = generateAmortizationSchedule(
  initialPropertyDetails.loanAmount,
  initialPropertyDetails.interestRate,
  initialPropertyDetails.loanTerm
);

const initialState: MortgageState = {
  location: initialLocation,
  propertyDetails: initialPropertyDetails,
  taxAndInsurance: initialTaxAndInsurance,
  payment: initialPayment,
  amortizationSchedule: initialAmortizationSchedule
};

// Action types
type ActionType = 
  | { type: 'UPDATE_LOCATION'; payload: Partial<Location> }
  | { type: 'UPDATE_PROPERTY_DETAILS'; payload: Partial<PropertyDetails> }
  | { type: 'RECALCULATE_PAYMENT' }
  | { type: 'RESET' };

// Reducer
const mortgageReducer = (state: MortgageState, action: ActionType): MortgageState => {
  switch (action.type) {    case 'UPDATE_LOCATION': {
      const updatedLocation = {
        ...state.location,
        ...action.payload
      };
      
      // Recalculate payment when location changes since it affects utilities
      const taxAndInsurance = calculateTaxAndInsurance(state.propertyDetails);
      const payment = calculateMortgagePayment(state.propertyDetails, taxAndInsurance, updatedLocation);
      
      return {
        ...state,
        location: updatedLocation,
        payment
      };
    }
      
    case 'UPDATE_PROPERTY_DETAILS': {
      const updatedDetails = {
        ...state.propertyDetails,
        ...action.payload
      };
      
      // Auto-calculate loan amount when price or down payment changes
      if (action.payload.price !== undefined || action.payload.downPayment !== undefined) {
        updatedDetails.loanAmount = updatedDetails.price - updatedDetails.downPayment;
        updatedDetails.downPaymentPercent = (updatedDetails.downPayment / updatedDetails.price) * 100;
      }
      
      // Auto-calculate down payment when down payment percentage changes
      if (action.payload.downPaymentPercent !== undefined) {
        updatedDetails.downPayment = (updatedDetails.price * updatedDetails.downPaymentPercent) / 100;
        updatedDetails.loanAmount = updatedDetails.price - updatedDetails.downPayment;
      }
        const taxAndInsurance = calculateTaxAndInsurance(updatedDetails);
      const payment = calculateMortgagePayment(updatedDetails, taxAndInsurance, state.location);
      const amortizationSchedule = generateAmortizationSchedule(
        updatedDetails.loanAmount,
        updatedDetails.interestRate,
        updatedDetails.loanTerm
      );
      
      return {
        ...state,
        propertyDetails: updatedDetails,
        taxAndInsurance,
        payment,
        amortizationSchedule
      };
    }
      case 'RECALCULATE_PAYMENT': {
      const taxAndInsurance = calculateTaxAndInsurance(state.propertyDetails);
      const payment = calculateMortgagePayment(state.propertyDetails, taxAndInsurance, state.location);
      const amortizationSchedule = generateAmortizationSchedule(
        state.propertyDetails.loanAmount,
        state.propertyDetails.interestRate,
        state.propertyDetails.loanTerm
      );
      
      return {
        ...state,
        taxAndInsurance,
        payment,
        amortizationSchedule
      };
    }
    
    case 'RESET':
      return initialState;
      
    default:
      return state;
  }
};

// Create context
type MortgageContextType = {
  state: MortgageState;
  updateLocation: (location: Partial<Location>) => void;
  updatePropertyDetails: (details: Partial<PropertyDetails>) => void;
  recalculatePayment: () => void;
  reset: () => void;
};

const MortgageContext = createContext<MortgageContextType | undefined>(undefined);

// Provider component
export const MortgageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(mortgageReducer, initialState);
  
  const updateLocation = (location: Partial<Location>) => {
    dispatch({ type: 'UPDATE_LOCATION', payload: location });
  };
  
  const updatePropertyDetails = (details: Partial<PropertyDetails>) => {
    dispatch({ type: 'UPDATE_PROPERTY_DETAILS', payload: details });
  };
  
  const recalculatePayment = () => {
    dispatch({ type: 'RECALCULATE_PAYMENT' });
  };
  
  const reset = () => {
    dispatch({ type: 'RESET' });
  };
  
  return (
    <MortgageContext.Provider value={{
      state,
      updateLocation,
      updatePropertyDetails,
      recalculatePayment,
      reset
    }}>
      {children}
    </MortgageContext.Provider>
  );
};

// Custom hook to use the context
export const useMortgage = () => {
  const context = useContext(MortgageContext);
  if (context === undefined) {
    throw new Error('useMortgage must be used within a MortgageProvider');
  }
  return context;
};