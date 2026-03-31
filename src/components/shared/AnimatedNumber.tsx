import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  format?: (value: number) => string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ 
  value, 
  duration = 1.5,
  format = (v) => v.toLocaleString()
}) => {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const displayValue = useTransform(spring, (current) => format(Math.round(current)));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{displayValue}</motion.span>;
};

export default AnimatedNumber;
