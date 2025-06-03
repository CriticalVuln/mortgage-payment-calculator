import React from 'react';

interface RadioOption<T> {
  value: T;
  label: string;
}

interface RadioGroupProps<T> {
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

function RadioGroup<T extends string | number>({
  options,
  value,
  onChange,
  label,
  orientation = 'vertical',
  className = '',
}: RadioGroupProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Find the original option value that matches the input value
    const selectedOption = options.find(option => String(option.value) === inputValue);
    if (selectedOption) {
      onChange(selectedOption.value);
    }
  };
  
  return (
    <div className={className}>
      {label && (
        <div className="mb-2 block text-sm font-medium text-neutral-700">
          {label}
        </div>
      )}
      
      <div className={`flex ${orientation === 'vertical' ? 'flex-col space-y-3' : 'flex-row flex-wrap gap-3'}`}>
        {options.map((option) => (
          <label
            key={String(option.value)}
            className={`relative flex items-center cursor-pointer group transition-all duration-200 ${
              orientation === 'horizontal' 
                ? 'px-4 py-2 border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50' 
                : 'hover:bg-neutral-50 rounded-md px-2 py-1'
            } ${
              value === option.value 
                ? orientation === 'horizontal'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'text-primary-700'
                : 'text-neutral-700'
            }`}
          >
            <input
              type="radio"
              className="h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500 focus:ring-2 focus:ring-offset-0 transition-colors"
              checked={value === option.value}
              value={String(option.value)}
              onChange={handleChange}
            />
            <span className={`ml-3 text-sm font-medium transition-colors ${
              value === option.value ? 'text-primary-700' : 'text-neutral-700 group-hover:text-neutral-900'
            }`}>
              {option.label}
            </span>
            {/* Visual indicator for selected state */}
            {value === option.value && orientation === 'horizontal' && (
              <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none" />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}

export default RadioGroup;