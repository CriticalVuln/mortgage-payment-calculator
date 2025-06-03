import React, { useState, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  valueDisplay?: string | ((value: number) => string);
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  valueDisplay,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value);
  
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };
  
  const percentage = ((localValue - min) / (max - min)) * 100;
  
  const getDisplayValue = () => {
    if (!valueDisplay) return localValue;
    if (typeof valueDisplay === 'function') return valueDisplay(localValue);
    return valueDisplay;
  };
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-neutral-700">
            {label}
          </label>
          <span className="text-sm font-medium text-neutral-900">
            {getDisplayValue()}
          </span>
        </div>
      )}
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={handleChange}
          className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #1f5cf7 0%, #1f5cf7 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
          }}
        />
        
        {/* Custom thumb */}
        <style jsx>{`
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
          }
          
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid #1f5cf7;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.15s ease;
          }
          
          input[type="range"]::-webkit-slider-thumb:hover {
            background: #1f5cf7;
            transform: scale(1.1);
          }
          
          input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #ffffff;
            border: 2px solid #1f5cf7;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.15s ease;
          }
          
          input[type="range"]::-moz-range-thumb:hover {
            background: #1f5cf7;
            transform: scale(1.1);
          }
        `}</style>
      </div>
      
      {!label && (
        <div className="flex justify-between text-xs text-neutral-500 mt-1 px-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

export default Slider;