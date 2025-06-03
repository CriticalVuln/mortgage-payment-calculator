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
    onChange(e.target.value as T);
  };
  
  return (
    <div className={className}>
      {label && (
        <div className="mb-2 block text-sm font-medium text-neutral-700">
          {label}
        </div>
      )}
      
      <div className={`flex ${orientation === 'vertical' ? 'flex-col space-y-2' : 'flex-row space-x-4'}`}>
        {options.map((option) => (
          <label
            key={String(option.value)}
            className="inline-flex items-center cursor-pointer"
          >
            <input
              type="radio"
              className="h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500 focus:ring-2 focus:ring-offset-0 rounded-full transition-all duration-150 ease-out"
              style={{
                appearance: 'none',
                backgroundColor: '#fff',
                borderWidth: '1px',
                backgroundOrigin: 'border-box',
              }}
              checked={value === option.value}
              value={String(option.value)}
              onChange={handleChange}
            />
            <span className="ml-2 text-sm text-neutral-700">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default RadioGroup;