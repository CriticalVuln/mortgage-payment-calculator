import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, DollarSign } from 'lucide-react';
import Card from '../ui/Card';
import { useMortgage } from '../../context/MortgageContext';
import { formatCurrency, calculatePrincipalAndInterest } from '../../utils/mortgageCalculator';

interface LoanComparison {
  term: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  interestSavings?: number;
}

const LoanComparison: React.FC = () => {
  const { state } = useMortgage();
  const { propertyDetails } = state;
  const [comparisons, setComparisons] = useState<LoanComparison[]>([]);

  useEffect(() => {
    const loanTerms = [15, 20, 30];
    
    const newComparisons = loanTerms.map(term => {
      const monthlyPayment = calculatePrincipalAndInterest(
        propertyDetails.loanAmount,
        propertyDetails.interestRate,
        term
      );
      
      const totalPayment = monthlyPayment * term * 12;
      const totalInterest = totalPayment - propertyDetails.loanAmount;
      
      return {
        term,
        monthlyPayment,
        totalInterest,
        totalPayment
      };
    });
    
    // Calculate interest savings compared to 30-year
    const thirtyYearInterest = newComparisons.find(c => c.term === 30)?.totalInterest || 0;
    const comparisonsWithSavings = newComparisons.map(comparison => ({
      ...comparison,
      interestSavings: thirtyYearInterest - comparison.totalInterest
    }));
    
    setComparisons(comparisonsWithSavings);
  }, [propertyDetails.loanAmount, propertyDetails.interestRate]);

  const getHighlightClass = (term: number) => {
    return term === propertyDetails.loanTerm 
      ? 'bg-primary-50 border-primary-200 border-2' 
      : 'bg-white border-neutral-200 border';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <Calculator className="h-5 w-5 text-primary-600 mr-2" />
        <h2 className="text-xl font-semibold text-neutral-800">Loan Term Comparison</h2>
      </div>
      
      <div className="space-y-4">
        {comparisons.map((comparison, index) => (
          <motion.div
            key={comparison.term}
            className={`p-4 rounded-lg ${getHighlightClass(comparison.term)}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-neutral-800">
                    {comparison.term}-Year Loan
                  </h3>
                  {comparison.term === propertyDetails.loanTerm && (
                    <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-neutral-500">Monthly Payment:</span>
                    <div className="font-semibold text-neutral-800">
                      {formatCurrency(comparison.monthlyPayment)}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-neutral-500">Total Interest:</span>
                    <div className="font-semibold text-neutral-800">
                      {formatCurrency(comparison.totalInterest)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                {comparison.interestSavings && comparison.interestSavings > 0 && (
                  <div className="flex items-center text-green-600">
                    <TrendingDown className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">
                      Save {formatCurrency(comparison.interestSavings)}
                    </span>
                  </div>
                )}
                
                <div className="text-xs text-neutral-500 mt-1">
                  Total: {formatCurrency(comparison.totalPayment)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="flex items-start">
          <DollarSign className="h-4 w-4 text-primary-600 mr-2 mt-0.5" />
          <div className="text-xs text-neutral-600">
            <strong>Tip:</strong> Shorter loan terms typically offer lower interest rates and significant interest savings, 
            but require higher monthly payments. Consider your budget and financial goals when choosing.
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LoanComparison;
