import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Landmark, AlertCircle, Shield, Building, CalendarClock, TrendingUp, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../ui/Card';
import Toggle from '../ui/Toggle';
import { useMortgage } from '../../context/MortgageContext';
import { formatCurrency } from '../../utils/mortgageCalculator';

const PaymentSummary: React.FC = () => {
  const { state, updatePropertyDetails } = useMortgage();
  const { payment, propertyDetails, location } = state;
  
  // Handle utilities toggle
  const handleUtilitiesToggle = (checked: boolean) => {
    updatePropertyDetails({ includeUtilities: checked });
  };
  
  // Prepare data for pie chart - include utilities if enabled
  const pieData = [
    { name: 'Principal & Interest', value: payment.principal, color: '#3178ff' },
    { name: 'Property Tax', value: payment.propertyTax, color: '#1aabca' },
    { name: 'Home Insurance', value: payment.homeInsurance, color: '#f06016' },
    { name: 'PMI', value: payment.pmi, color: '#10b981' },
    { name: 'HOA Fees', value: payment.hoaFees, color: '#eab308' }
  ];
  
  // Add utilities to pie chart data if included
  if (propertyDetails.includeUtilities && payment.utilities) {
    pieData.push({ name: 'Utilities', value: payment.utilities, color: '#8b5cf6' });
  }
  
  // Filter out zero values
  const filteredPieData = pieData.filter(item => item.value > 0);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-neutral-200">
          <p className="text-sm font-medium text-neutral-900">{payload[0].name}</p>
          <p className="text-sm text-primary-600 font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  // Create payment items array - include utilities if enabled
  const totalPaymentItems = [
    { 
      name: 'Principal & Interest',
      value: payment.principal,
      icon: <DollarSign className="h-5 w-5 text-primary-500" />,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    { 
      name: 'Property Tax',
      value: payment.propertyTax,
      icon: <Landmark className="h-5 w-5 text-secondary-500" />,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50'
    },
    { 
      name: 'Home Insurance',
      value: payment.homeInsurance,
      icon: <Shield className="h-5 w-5 text-accent-500" />,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50'
    }
  ];
  
  // Add PMI if applicable
  if (payment.pmi > 0) {
    totalPaymentItems.push({ 
      name: 'PMI',
      value: payment.pmi,
      icon: <AlertCircle className="h-5 w-5 text-success-500" />,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    });
  }
  
  // Add HOA fees if applicable
  if (payment.hoaFees > 0) {
    totalPaymentItems.push({ 
      name: 'HOA Fees',
      value: payment.hoaFees,
      icon: <Building className="h-5 w-5 text-warning-500" />,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50'
    });
  }
  
  // Add utilities if enabled
  if (propertyDetails.includeUtilities && payment.utilities) {
    totalPaymentItems.push({
      name: 'Utilities',
      value: payment.utilities,
      icon: <Zap className="h-5 w-5 text-purple-500" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    });
  }
  
  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <CalendarClock className="h-5 w-5 text-primary-600 mr-2" />
        <h2 className="text-xl font-semibold text-neutral-800">Payment Summary</h2>
      </div>
      
      <div className="space-y-6">
        <motion.div 
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-5 text-white"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <p className="text-sm font-medium text-primary-100">Estimated Monthly Payment</p>
          <div className="flex items-baseline mt-1">
            <h3 className="text-3xl font-bold">{formatCurrency(payment.total)}</h3>
            <span className="ml-2 text-primary-100">/month</span>
          </div>
          
          <div className="mt-3 text-sm text-primary-100">
            <div className="flex justify-between items-center">
              <span>Loan Amount</span>
              <span className="font-medium text-white">{formatCurrency(propertyDetails.loanAmount)}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span>Loan Term</span>
              <span className="font-medium text-white">{propertyDetails.loanTerm} years</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span>Interest Rate</span>
              <span className="font-medium text-white">{propertyDetails.interestRate}%</span>
            </div>
          </div>
        </motion.div>
        
        <div className="border-t border-neutral-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-neutral-800">Include Utilities</span>
            </div>
            <Toggle 
              checked={propertyDetails.includeUtilities} 
              onChange={handleUtilitiesToggle}
              className="scale-90"
            />
          </div>
          {propertyDetails.includeUtilities && payment.utilities && (
            <motion.div 
              className="text-xs text-neutral-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Based on average utility costs in {location.state || 'your state'} for a {propertyDetails.squareFeet || 2000} sq ft home.
              Includes electricity, water, gas, internet, and trash service.
            </motion.div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-base font-medium text-neutral-800 mb-3">Payment Breakdown</h3>
            <div className="space-y-3">
              {totalPaymentItems.map((item, index) => (
                <motion.div 
                  key={item.name}
                  className={`flex justify-between items-center p-3 rounded-lg ${item.bgColor}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-2 text-sm font-medium text-neutral-700">{item.name}</span>
                  </div>
                  <span className={`font-semibold ${item.color}`}>{formatCurrency(item.value)}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium text-neutral-800 mb-3">Visual Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                  >
                    {filteredPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {filteredPieData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs text-neutral-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-primary-600 mr-2" />
            <h3 className="text-base font-medium text-neutral-800">Affordability Analysis</h3>
          </div>
          
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Recommended Income:</span>
              <span className="font-medium text-neutral-900">{formatCurrency(payment.total * 12 / 0.28)}/year</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Payment-to-Income Ratio:</span>
              <span className="font-medium text-neutral-900">28%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Down Payment Ratio:</span>
              <span className="font-medium text-neutral-900">{propertyDetails.downPaymentPercent.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PaymentSummary;