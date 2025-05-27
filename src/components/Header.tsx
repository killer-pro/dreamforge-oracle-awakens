
import React from 'react';
import { Moon, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="relative z-20 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="relative">
            <Moon className="w-8 h-8 text-purple-300" />
            <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
            DreamForge
          </h1>
        </div>
      </div>
    </header>
  );
};
