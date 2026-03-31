import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

const variants = {
  primary: 'bg-primary-500/20 text-primary-400 ring-primary-500/30',
  secondary: 'bg-secondary-500/20 text-secondary-400 ring-secondary-500/30',
  success: 'bg-green-500/20 text-green-400 ring-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 ring-yellow-500/30',
  danger: 'bg-red-500/20 text-red-400 ring-red-500/30',
  gray: 'bg-white/10 text-gray-400 ring-white/20',
};

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base',
};

const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'gray',
  size = 'md',
  icon,
  className
}) => {
  return (
    <span
      className={twMerge(
        'inline-flex items-center rounded-md font-medium ring-1 ring-inset',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon && <span className="mr-1.5 -ml-0.5 h-4 w-4 text-current opacity-80">{icon}</span>}
      {label}
    </span>
  );
};

export default Badge;
