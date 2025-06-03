import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowDownRight, Calendar } from 'lucide-react';
import Card from '../ui/Card';
import { useMortgage } from '../../context/MortgageContext';
import { formatCurrency } from '../../utils/mortgageCalculator';

const AmortizationChart: React.FC = () => {
  const { state } = useMortgage();
  const [visibleYears, setVisibleYears] = useState(5);
  
  // Aggregate amortization data by year
  const yearlyData = React.useMemo(() => {
    const data = [];
    const years = Math.min(state.propertyDetails.loanTerm, 30); // Cap at 30 years for display
    
    for (let year = 1; year <= years; year++) {
      const yearStart = (year - 1) * 12;
      const yearEnd = Math.min(year * 12, state.amortizationSchedule.length) - 1;
      
      if (yearStart >= state.amortizationSchedule.length) break;
      
      const yearlyPrincipal = state.amortizationSchedule
        .slice(yearStart, yearEnd + 1)
        .reduce((sum, month) => sum + month.principal, 0);
        
      const yearlyInterest = state.amortizationSchedule
        .slice(yearStart, yearEnd + 1)
        .reduce((sum, month) => sum + month.interest, 0);
      
      const remainingBalance = yearEnd < state.amortizationSchedule.length 
        ? state.amortizationSchedule[yearEnd].balance 
        : 0;
      
      data.push({
        year,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance: remainingBalance
      });
    }
    
    return data;
  }, [state.amortizationSchedule, state.propertyDetails.loanTerm]);
  
  const displayData = yearlyData.slice(0, visibleYears);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-neutral-200">
          <p className="text-sm font-medium text-neutral-900 mb-1">Year {label}</p>
          <p className="text-xs text-primary-600">
            <span className="font-medium">Principal: </span>
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs text-accent-600">
            <span className="font-medium">Interest: </span>
            {formatCurrency(payload[1].value)}
          </p>
          <p className="text-xs text-neutral-600 mt-1">
            <span className="font-medium">Remaining Balance: </span>
            {formatCurrency(payload[0].payload.balance)}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-primary-600 mr-2" />
          <h2 className="text-xl font-semibold text-neutral-800">Amortization Schedule</h2>
        </div>
        
        <select 
          className="text-sm border border-neutral-300 rounded-lg p-1.5"
          value={visibleYears}
          onChange={(e) => setVisibleYears(Number(e.target.value))}
        >
          <option value={5}>5 Years</option>
          <option value={10}>10 Years</option>
          <option value={15}>15 Years</option>
          <option value={30}>Full Term</option>
        </select>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="principal" name="Principal" stackId="a" fill="#3178ff" />
            <Bar dataKey="interest" name="Interest" stackId="a" fill="#f06016" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <div className="flex items-start">
          <ArrowDownRight className="h-5 w-5 text-success-500 mt-1 mr-2" />
          <div>
            <h3 className="font-medium text-neutral-800">Payment Insights</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Over the first {visibleYears} years, you'll pay approximately {formatCurrency(displayData.reduce((sum, year) => sum + year.interest, 0))} in 
              interest while reducing your principal by {formatCurrency(displayData.reduce((sum, year) => sum + year.principal, 0))}.
            </p>
            
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-500">Total Interest (Full Term)</p>
                <p className="text-base font-medium text-neutral-900">
                  {formatCurrency(yearlyData.reduce((sum, year) => sum + year.interest, 0))}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Total Cost (Full Term)</p>
                <p className="text-base font-medium text-neutral-900">
                  {formatCurrency(state.propertyDetails.loanAmount + yearlyData.reduce((sum, year) => sum + year.interest, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AmortizationChart;