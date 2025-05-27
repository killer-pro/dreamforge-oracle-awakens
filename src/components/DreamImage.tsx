import React from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

interface DreamImageProps {
  imageUrl: string | null;
  isLoading: boolean;
  dreamDescription: string;
}

const DreamImage: React.FC<DreamImageProps> = ({ imageUrl, isLoading, dreamDescription }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto mb-8">
        <div className="dream-card p-6">
          <div className="flex items-center justify-center h-100 bg-violet-900/20 rounded-lg animate-pulse">
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-2 animate-spin" />
              <p className="text-violet-300 text-sm">Visualizing your dream...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!imageUrl) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto mb-8 animate-fade-in">
      <div className="dream-card overflow-hidden">
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={`Visual representation of: ${dreamDescription.slice(0, 100)}...`}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white/90">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Dream Visualization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamImage;
