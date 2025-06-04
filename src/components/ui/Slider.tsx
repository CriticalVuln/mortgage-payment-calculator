import React, { useState, useEffect } from 'react';
import './SliderStyles.css';

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
          className="custom-range-slider w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #1f5cf7 0%, #1f5cf7 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`
          }}
        />
        
        {/* Custom thumb styles are moved to a className */}
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