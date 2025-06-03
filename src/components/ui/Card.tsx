import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  isGlass?: boolean;
  noAnimation?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  isGlass = false,
  noAnimation = false
}) => {
  const baseClasses = "rounded-xl shadow-md overflow-hidden";
  const glassClasses = isGlass 
    ? "bg-white/70 backdrop-blur-md shadow-glass border border-white/20" 
    : "bg-white";
  
  const combinedClasses = `${baseClasses} ${glassClasses} ${className}`;
  
  if (noAnimation) {
    return (
      <div className={combinedClasses}>
        {children}
      </div>
    );
  }
  
  return (
    <motion.div 
      className={combinedClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        ease: [0.25, 0.1, 0.25, 1.0] // Cubic bezier for a more natural motion
      }}
      whileHover={{ 
        y: -3,
        transition: { 
          duration: 0.2, 
          ease: "easeOut" 
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export default Card;