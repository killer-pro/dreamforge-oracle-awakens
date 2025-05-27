
import React from 'react';
import { Brain } from 'lucide-react';

interface ScholarHeadProps {
  isVisible: boolean;
}

const ScholarHead: React.FC<ScholarHeadProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-fade-in">
      {/* Nuage de pensée */}
      <div className="relative mb-4">
        {/* Bulle de pensée principale */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl px-6 py-4 shadow-2xl border border-violet-200/50 relative">
          <div className="flex items-center gap-2 text-violet-800 font-medium text-lg">
            <span>Interesting</span>
            <div className="flex items-center">
              <span className="animate-pulse">.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
            </div>
          </div>
          
          {/* Queue de la bulle */}
          <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white/90 rotate-45 border-r border-b border-violet-200/50"></div>
        </div>
        
        {/* Petites bulles */}
        <div className="absolute -bottom-1 left-4 w-3 h-3 bg-white/80 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1 left-2 w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      </div>
      
      {/* Tête de savant */}
      <div className="relative mx-auto w-24 h-24">
        {/* Cercle de fond avec gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-indigo-200 rounded-full shadow-xl animate-float"></div>
        
        {/* Icône cerveau */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-12 h-12 text-violet-700 animate-pulse" />
        </div>
        
        {/* Effet de brillance */}
        <div className="absolute inset-2 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-full animate-spin-slow"></div>
        
        {/* Particules flottantes */}
        <div className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="absolute -top-1 -left-3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -bottom-3 right-1 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default ScholarHead;
