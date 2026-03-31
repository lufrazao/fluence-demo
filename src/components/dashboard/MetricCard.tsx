import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  change?: number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend,
  loading 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start justify-between"
    >
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-2">
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            value
          )}
        </h3>
        
        {change !== undefined && (
          <div className="flex items-center mt-2">
            <span 
              className={clsx(
                "text-xs font-medium px-2 py-0.5 rounded-full flex items-center",
                change > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              )}
            >
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-gray-400 ml-2">from last month</span>
          </div>
        )}
      </div>
      
      {icon && (
        <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
          {icon}
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;
