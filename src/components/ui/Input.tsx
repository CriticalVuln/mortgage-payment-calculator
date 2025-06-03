import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  sanitize?: boolean; // Enable input sanitization
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  prefix,
  suffix,
  sanitize = true,
  className = '',
  onChange,
  ...props
}, ref) => {
  // Input sanitization function
  const sanitizeInput = (value: string): string => {
    if (!sanitize) return value;
    
    // Remove potentially dangerous characters for basic XSS prevention
    return value
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (sanitize) {
      const sanitizedValue = sanitizeInput(e.target.value);
      e.target.value = sanitizedValue;
    }
    
    if (onChange) {
      onChange(e);
    }
  };
  const inputClasses = `
    block w-full px-4 py-2.5 rounded-lg border
    ${error 
      ? 'border-error-300 focus:border-error-500 focus:ring-error-500' 
      : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
    }
    ${prefix ? 'pl-10' : ''}
    ${suffix ? 'pr-10' : ''}
    ${icon ? 'pl-10' : ''}
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    transition-all duration-200 ease-out
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-neutral-500">{prefix}</span>
          </div>
        )}
        
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          onChange={handleChange}
          {...props}
        />
        
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-neutral-500">{suffix}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;