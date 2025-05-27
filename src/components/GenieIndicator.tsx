
import React, { useState, useEffect } from 'react';

const GenieIndicator: React.FC = () => {
  const [dots, setDots] = useState('...');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots === '...') return '..';
        if (prevDots === '..') return '.';
        if (prevDots === '.') return '..';
        return '...';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-end space-x-2 animate-fade-in">
      {/* Bulle de pensée */}
      <div className="relative">
        {/* Petites bulles qui remontent */}
        <div className="absolute -bottom-3 left-4 w-2 h-2 bg-white/80 rounded-full animate-bounce"></div>
        <div className="absolute -bottom-6 left-2 w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        
        {/* Bulle principale */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-xl border border-violet-200/50 relative">
          <div className="flex items-center text-violet-800 font-medium text-sm">
            <span>Interesting</span>
            <span className="ml-1 w-6 text-left">{dots}</span>
          </div>
          
          {/* Queue de la bulle */}
          <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white/95 rotate-45 border-r border-b border-violet-200/50"></div>
        </div>
      </div>
      
      {/* Génie */}
      <div className="relative">
        {/* Corps du génie */}
        <div className="w-16 h-20 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-t-full relative animate-float">
          {/* Visage */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gradient-to-b from-purple-300 to-purple-400 rounded-full">
            {/* Yeux */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white rounded-full"></div>
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
            {/* Bouche */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-white rounded-full"></div>
          </div>
          
          {/* Bras */}
          <div className="absolute top-6 -left-2 w-4 h-2 bg-purple-400 rounded-full rotate-45"></div>
          <div className="absolute top-6 -right-2 w-4 h-2 bg-purple-400 rounded-full -rotate-45"></div>
        </div>
        
        {/* Queue vaporeuse */}
        <div className="w-8 h-12 bg-gradient-to-b from-indigo-500 to-purple-600 relative" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 70% 100%, 30% 100%)' }}>
          {/* Effet de vapeur */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
        
        {/* Particules magiques */}
        <div className="absolute -top-2 -left-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute -top-1 right-1 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-4 -right-3 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default GenieIndicator;
