import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useMortgage } from '../../context/MortgageContext';
import { fetchCurrentInterestRates, getCreditScoreRange } from '../../services/interestRateService';

interface RateComparison {
  term: number;
  currentRate: number;
  yourRate: number;
  difference: number;
  trend: 'up' | 'down' | 'same';
}

const RateComparison: React.FC = () => {
  const { state } = useMortgage();
  const { propertyDetails } = state;
  const [comparisons, setComparisons] = useState<RateComparison[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadRateComparisons = async () => {
    setIsLoading(true);
    try {
      const rates = await fetchCurrentInterestRates();
      const creditRange = getCreditScoreRange(propertyDetails.creditScore);
      
      const thirtyYearRate = rates.thirtyYearFixed[creditRange]?.rate || 6.5;
      const twentyYearRate = rates.twentyYearFixed[creditRange]?.rate || 6.25;
      const fifteenYearRate = rates.fifteenYearFixed[creditRange]?.rate || 5.75;
      
      const newComparisons: RateComparison[] = [
        {
          term: 30,
          currentRate: thirtyYearRate,
          yourRate: propertyDetails.loanTerm === 30 ? propertyDetails.interestRate : thirtyYearRate,
          difference: propertyDetails.loanTerm === 30 ? 
            propertyDetails.interestRate - thirtyYearRate : 0,
          trend: propertyDetails.loanTerm === 30 ? 
            (propertyDetails.interestRate > thirtyYearRate ? 'up' : 
             propertyDetails.interestRate < thirtyYearRate ? 'down' : 'same') : 'same'
        },
        {
          term: 20,
          currentRate: twentyYearRate,
          yourRate: propertyDetails.loanTerm === 20 ? propertyDetails.interestRate : twentyYearRate,
          difference: propertyDetails.loanTerm === 20 ? 
            propertyDetails.interestRate - twentyYearRate : 0,
          trend: propertyDetails.loanTerm === 20 ? 
            (propertyDetails.interestRate > twentyYearRate ? 'up' : 
             propertyDetails.interestRate < twentyYearRate ? 'down' : 'same') : 'same'
        },
        {
          term: 15,
          currentRate: fifteenYearRate,
          yourRate: propertyDetails.loanTerm === 15 ? propertyDetails.interestRate : fifteenYearRate,
          difference: propertyDetails.loanTerm === 15 ? 
            propertyDetails.interestRate - fifteenYearRate : 0,
          trend: propertyDetails.loanTerm === 15 ? 
            (propertyDetails.interestRate > fifteenYearRate ? 'up' : 
             propertyDetails.interestRate < fifteenYearRate ? 'down' : 'same') : 'same'
        }
      ];
        setComparisons(newComparisons);
      setLastUpdated(new Date());
    } catch (error) {
      // Error loading rate comparisons
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRateComparisons();
  }, [propertyDetails.creditScore, propertyDetails.loanTerm, propertyDetails.interestRate]);

  const getTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-neutral-400" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up':
        return 'text-red-600';
      case 'down':
        return 'text-green-600';
      default:
        return 'text-neutral-600';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-neutral-800">Market Rate Comparison</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadRateComparisons}
          disabled={isLoading}
          className="flex items-center text-xs text-primary-600 hover:text-primary-700"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Updating...' : 'Refresh'}
        </Button>
      </div>      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comparisons.map((comparison, index) => (
          <motion.div
            key={comparison.term}
            className={`p-4 rounded-lg border ${
              comparison.term === propertyDetails.loanTerm 
                ? 'bg-primary-50 border-primary-200' 
                : 'bg-neutral-50 border-neutral-200'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <h3 className="text-sm font-medium text-neutral-800">
                  {comparison.term}-Year Fixed
                </h3>
                {comparison.term === propertyDetails.loanTerm && (
                  <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                    Current
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-neutral-500 block">Market Rate</span>
                  <span className="text-lg font-bold text-neutral-700">
                    {comparison.currentRate.toFixed(3)}%
                  </span>
                </div>
                
                <div>
                  <span className="text-xs text-neutral-500 block">Your Rate</span>
                  <span className="text-sm font-medium text-neutral-700">
                    {comparison.yourRate.toFixed(3)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-center pt-1">
                  {getTrendIcon(comparison.trend)}
                  <span className={`ml-1 text-sm font-medium ${getTrendColor(comparison.trend)}`}>
                    {comparison.trend === 'same' ? 'Same' : 
                     `${Math.abs(comparison.difference).toFixed(3)}%`}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-xs text-neutral-500 text-center">
        Last updated: {lastUpdated.toLocaleTimeString()} • 
        Rates for credit score {propertyDetails.creditScore}
      </div>
    </Card>
  );
};

export default RateComparison;
