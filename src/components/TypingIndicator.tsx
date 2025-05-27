import React, { useState, useEffect } from 'react';

interface TypingIndicatorProps {
  text?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ text = 'Interesting' }) => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots === '.') return '..';
        if (prevDots === '..') return '...';
        if (prevDots === '...') return '..';
        return '.';
      });
    }, 300); // Adjust speed of dot animation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center text-violet-300 text-lg">
      <span className="mr-1">{text}</span>
      <span className="w-4 text-left">{dots}</span>
    </div>
  );
};

export default TypingIndicator; 