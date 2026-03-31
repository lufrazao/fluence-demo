import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number; // 0 to 100
  color?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'bg-primary-600',
  className
}) => {
  return (
    <div className={`w-full bg-white/10 rounded-full h-2.5 ${className}`}>
      <motion.div
        className={`h-2.5 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default ProgressBar;
