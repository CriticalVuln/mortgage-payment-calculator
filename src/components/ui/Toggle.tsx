import React from 'react';
import { motion } from 'framer-motion';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: 'left' | 'right';
  disabled?: boolean;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  disabled = false,
  className = '',
}) => {
  const toggleClasses = `
    relative inline-flex items-center rounded-full 
    ${checked ? 'bg-primary-600' : 'bg-neutral-200'} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    w-11 h-6 transition-colors duration-150 ease-out
    ${className}
  `;
  
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };
  
  return (
    <div className={`inline-flex items-center ${labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row'}`}>
      {label && (
        <span 
          className={`
            text-sm font-medium text-neutral-700
            ${labelPosition === 'left' ? 'mr-3' : 'ml-3'}
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          {label}
        </span>
      )}
      
      <div 
        className={toggleClasses}
        onClick={handleClick}
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <motion.span
          className={`
            inline-block w-4 h-4 rounded-full bg-white shadow transform
          `}
          animate={{ 
            x: checked ? 20 : 2,
            transition: { type: "spring", stiffness: 500, damping: 25, mass: 0.6 }
          }}
        />
      </div>
    </div>
  );
};

export default Toggle;