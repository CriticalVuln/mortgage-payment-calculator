import React, { useEffect, useState } from 'react';
import { Percent, Building, RefreshCw } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Slider from '../ui/Slider';
import RadioGroup from '../ui/RadioGroup';
import Toggle from '../ui/Toggle';
import Button from '../ui/Button';
import { useMortgage } from '../../context/MortgageContext';
import { formatCurrency, calculatePrincipalAndInterest } from '../../utils/mortgageCalculator';
import { getInterestRateForCreditScore } from '../../services/interestRateService';
import { 
  validateNumericInput, 
  validateInterestRate, 
  validateLoanAmount
} from '../../utils/validation';

const PropertyInputs: React.FC = () => {
  const { state, updatePropertyDetails } = useMortgage();
  const { propertyDetails } = state;
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  
  const propertyTypeOptions = [
    { value: 'single-family' as const, label: 'Single Family' },
    { value: 'condo' as const, label: 'Condo' },
    { value: 'townhouse' as const, label: 'Townhouse' },
    { value: 'multi-family' as const, label: 'Multi-Family' }
  ];
  
  const occupancyOptions = [
    { value: 'primary' as const, label: 'Primary Residence' },
    { value: 'secondary' as const, label: 'Secondary Home' },
    { value: 'investment' as const, label: 'Investment Property' }
  ];
  
  const loanTermOptions = [
    { value: 15, label: '15 Years' },
    { value: 20, label: '20 Years' },
    { value: 30, label: '30 Years' }
  ];
  
  // Effect to update interest rate when credit score or loan term changes
  useEffect(() => {
    const updateInterestRate = async () => {
      try {
        setIsLoadingRate(true);
        const currentRate = await getInterestRateForCreditScore(
          propertyDetails.creditScore, 
          propertyDetails.loanTerm
        );
        updatePropertyDetails({ interestRate: currentRate });
      } catch (error) {
        // Failed to fetch current interest rates - using existing rate
      } finally {
        setIsLoadingRate(false);
      }
    };
    
    updateInterestRate();
  }, [propertyDetails.creditScore, propertyDetails.loanTerm]);

  // Function to manually refresh interest rate
  const handleRefreshInterestRate = async () => {
    try {
      setIsLoadingRate(true);
      const currentRate = await getInterestRateForCreditScore(
        propertyDetails.creditScore, 
        propertyDetails.loanTerm
      );
      updatePropertyDetails({ interestRate: currentRate });
    } catch (error) {
      // Failed to fetch current interest rates - using existing rate
    } finally {
      setIsLoadingRate(false);
    }
  };
  
  // Enhanced input handlers with validation
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateLoanAmount(parseFloat(e.target.value) || 0);
    updatePropertyDetails({ price: value });
  };

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateNumericInput(parseFloat(e.target.value) || 0, 0, propertyDetails.price);
    updatePropertyDetails({ downPayment: value });
  };

  const handleDownPaymentPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateNumericInput(parseFloat(e.target.value) || 0, 0, 100);
    updatePropertyDetails({ downPaymentPercent: value });
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateInterestRate(parseFloat(e.target.value) || 0);
    updatePropertyDetails({ interestRate: value });
  };

  const handleHoaFeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = validateNumericInput(parseFloat(e.target.value) || 0, 0, 5000);
    updatePropertyDetails({ hoaFees: value });
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <Building className="h-5 w-5 text-primary-600 mr-2" />
        <h2 className="text-xl font-semibold text-neutral-800">Property Details</h2>
      </div>
      
      <div className="space-y-6">
        <Input
          label="Purchase Price"
          type="number"
          min={50000}
          step={10000}
          prefix="$"
          value={propertyDetails.price}
          onChange={handlePriceChange}
        />
        
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-neutral-700">
              Down Payment
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              min={0}
              step={5000}
              prefix="$"
              value={propertyDetails.downPayment}
              onChange={handleDownPaymentChange}
            />
            
            <Input
              type="number"
              min={0}
              max={100}
              step={1}
              suffix="%"
              value={propertyDetails.downPaymentPercent}
              onChange={handleDownPaymentPercentChange}
            />
          </div>
          
          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Loan Amount:</span>
              <span className="font-medium text-neutral-900">{formatCurrency(propertyDetails.loanAmount)}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <Slider
            label="Credit Score"
            min={580}
            max={850}
            step={10}
            value={propertyDetails.creditScore}
            onChange={(value) => updatePropertyDetails({ creditScore: value })}
          />
          
          <div className="space-y-2">
            <RadioGroup
              label="Loan Term"
              options={loanTermOptions}
              value={propertyDetails.loanTerm}
              onChange={(value) => updatePropertyDetails({ loanTerm: value })}
              orientation="horizontal"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-neutral-700">
                Interest Rate
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshInterestRate}
                className="flex items-center text-xs text-primary-600 hover:text-primary-700"
                disabled={isLoadingRate}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                {isLoadingRate ? 'Updating...' : 'Get Current Rate'}
              </Button>
            </div>
            <Input
              type="number"
              min={0}
              max={15}
              step={0.125}
              suffix="%"
              value={propertyDetails.interestRate}
              onChange={handleInterestRateChange}
              icon={<Percent className="h-5 w-5 text-neutral-400" />}
              disabled={isLoadingRate}
            />
            <div className="text-xs text-neutral-500">
              Based on your credit score of {propertyDetails.creditScore} and {propertyDetails.loanTerm}-year term
            </div>
          </div>
          
          <RadioGroup
            label="Property Type"
            options={propertyTypeOptions}
            value={propertyDetails.propertyType}
            onChange={(value) => updatePropertyDetails({ propertyType: value })}
          />
          
          <RadioGroup
            label="Occupancy"
            options={occupancyOptions}
            value={propertyDetails.occupancy}
            onChange={(value) => updatePropertyDetails({ occupancy: value })}
          />
          
          <Input
            label="HOA Fees (monthly)"
            type="number"
            min={0}
            step={50}
            prefix="$"
            value={propertyDetails.hoaFees}
            onChange={handleHoaFeesChange}
          />
          
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-neutral-800">Estimated Monthly Payment</h4>
                <p className="text-xs text-neutral-500 mt-1">Principal & Interest only</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary-700">
                  {formatCurrency(calculatePrincipalAndInterest(propertyDetails.loanAmount, propertyDetails.interestRate, propertyDetails.loanTerm))}
                </div>
                <div className="text-xs text-neutral-500">per month</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3 pt-2">
            <Toggle
              label="I am an active military member or veteran"
              checked={propertyDetails.isVeteran}
              onChange={(checked) => updatePropertyDetails({ isVeteran: checked })}
            />
            
            <Toggle
              label="I am a first-time home buyer"
              checked={propertyDetails.isFirstTimeBuyer}
              onChange={(checked) => updatePropertyDetails({ isFirstTimeBuyer: checked })}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyInputs;