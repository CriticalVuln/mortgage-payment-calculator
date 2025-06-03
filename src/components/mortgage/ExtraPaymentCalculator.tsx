import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { useMortgage } from '../../context/MortgageContext';
import { formatCurrency, calculatePrincipalAndInterest } from '../../utils/mortgageCalculator';

interface PayoffComparison {
  scenario: string;
  monthsToPayoff: number;
  totalInterest: number;
  interestSaved: number;
  timeSaved: string;
}

const ExtraPaymentCalculator: React.FC = () => {
  const { state } = useMortgage();
  const { propertyDetails } = state;
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [comparison, setComparison] = useState<PayoffComparison | null>(null);

  const calculatePayoffScenarios = () => {
    const { loanAmount, interestRate, loanTerm } = propertyDetails;
    const monthlyRate = interestRate / 100 / 12;
    const originalPayment = calculatePrincipalAndInterest(loanAmount, interestRate, loanTerm);
    const originalMonths = loanTerm * 12;
    
    // Calculate original scenario
    const originalTotalPayment = originalPayment * originalMonths;
    const originalTotalInterest = originalTotalPayment - loanAmount;
    
    if (extraPayment > 0) {
      // Calculate with extra payments
      let balance = loanAmount;
      let months = 0;
      const newMonthlyPayment = originalPayment + extraPayment;
      
      while (balance > 0 && months < originalMonths) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = newMonthlyPayment - interestPayment;
        
        if (principalPayment <= 0) break;
        
        balance -= principalPayment;
        months++;
        
        if (balance < 0) balance = 0;
      }
      
      const newTotalPayment = newMonthlyPayment * months;
      const newTotalInterest = newTotalPayment - loanAmount;
      const interestSaved = originalTotalInterest - newTotalInterest;
      const monthsSaved = originalMonths - months;
      const yearsSaved = Math.floor(monthsSaved / 12);
      const remainingMonths = monthsSaved % 12;
      
      let timeSaved = '';
      if (yearsSaved > 0) {
        timeSaved = `${yearsSaved} year${yearsSaved > 1 ? 's' : ''}`;
        if (remainingMonths > 0) {
          timeSaved += ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
        }
      } else if (remainingMonths > 0) {
        timeSaved = `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
      } else {
        timeSaved = 'Less than 1 month';
      }
      
      setComparison({
        scenario: 'With Extra Payment',
        monthsToPayoff: months,
        totalInterest: newTotalInterest,
        interestSaved,
        timeSaved
      });
    } else {
      setComparison(null);
    }
  };

  useEffect(() => {
    calculatePayoffScenarios();
  }, [extraPayment, propertyDetails]);

  const originalPayment = calculatePrincipalAndInterest(
    propertyDetails.loanAmount, 
    propertyDetails.interestRate, 
    propertyDetails.loanTerm
  );

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <Calculator className="h-5 w-5 text-primary-600 mr-2" />
        <h2 className="text-xl font-semibold text-neutral-800">Extra Payment Calculator</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-neutral-700">Current Monthly Payment:</span>
            <span className="text-lg font-bold text-neutral-900">{formatCurrency(originalPayment)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-600">Loan Term:</span>
            <span className="text-sm text-neutral-700">{propertyDetails.loanTerm} years</span>
          </div>
        </div>
        
        <Input
          label="Extra Monthly Payment"
          type="number"
          min={0}
          step={50}
          prefix="$"
          value={extraPayment}
          onChange={(e) => setExtraPayment(parseFloat(e.target.value) || 0)}
          placeholder="Enter additional payment amount"
        />
        
        {comparison && comparison.interestSaved > 0 && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <TrendingDown className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-800">Savings Summary</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-1">
                    <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-green-700">Interest Saved</span>
                  </div>
                  <div className="text-xl font-bold text-green-800">
                    {formatCurrency(comparison.interestSaved)}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-green-700">Time Saved</span>
                  </div>
                  <div className="text-xl font-bold text-green-800">
                    {comparison.timeSaved}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-neutral-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-700 mb-3">Payment Comparison</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">New Monthly Payment:</span>
                  <span className="font-medium text-neutral-900">
                    {formatCurrency(originalPayment + extraPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Payoff Time:</span>
                  <span className="font-medium text-neutral-900">
                    {Math.floor(comparison.monthsToPayoff / 12)} years {comparison.monthsToPayoff % 12} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Interest:</span>
                  <span className="font-medium text-neutral-900">
                    {formatCurrency(comparison.totalInterest)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {extraPayment === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-neutral-500">
              Enter an extra payment amount to see potential savings
            </p>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <DollarSign className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
            <div className="text-xs text-blue-700">
              <strong>Tip:</strong> Even small extra payments can result in significant interest savings over the life of your loan. 
              Consider applying windfalls like tax refunds or bonuses toward your mortgage principal.
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExtraPaymentCalculator;