
import React, { useState } from 'react';
import { toast } from 'sonner';
import StarryBackground from '@/components/StarryBackground';
import DreamInput from '@/components/DreamInput';
import DreamAnalysis, { DreamAnalysisResult } from '@/components/DreamAnalysis';
import DreamImage from '@/components/DreamImage';
import LanguageSelector from '@/components/LanguageSelector';
import GenieIndicator from '@/components/GenieIndicator';
import { analyzeDream } from '@/services/dreamService';
import { generateDreamImage } from '@/services/imageService';

const Index = () => {
  const [dreamResult, setDreamResult] = useState<DreamAnalysisResult | null>(null);
  const [dreamImages, setDreamImages] = useState<{[key: string]: string | null}>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<{[key: string]: boolean}>({});
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const handleDreamSubmit = async (dream: string) => {
    try {
      setIsLoading(true);
      setDreamImages({});
      setIsImageLoading({});
      
      // Analyser le rêve
      const result = await analyzeDream(dream, selectedLanguage);
      setDreamResult(result);
      
      // Générer plusieurs images de façon asynchrone
      const imageKeys = ['summary', 'psychological', 'spiritual', 'creature'];
      const imagePromises = imageKeys.map(async (key) => {
        setIsImageLoading(prev => ({ ...prev, [key]: true }));
        
        let prompt = '';
        switch (key) {
          case 'summary':
            prompt = result.summary;
            break;
          case 'psychological':
            prompt = result.psychological;
            break;
          case 'spiritual':
            prompt = result.spiritual;
            break;
          case 'creature':
            prompt = `${result.creature.name}: ${result.creature.description}`;
            break;
        }
        
        try {
          const imageUrl = await generateDreamImage({ 
            dreamDescription: prompt, 
            style: key === 'creature' ? 'mystical' : 'surreal' 
          });
          setDreamImages(prev => ({ ...prev, [key]: imageUrl }));
        } catch (error) {
          console.error(`Error generating ${key} image:`, error);
        } finally {
          setIsImageLoading(prev => ({ ...prev, [key]: false }));
        }
      });
      
      // Attendre que toutes les images soient générées
      await Promise.all(imagePromises);
      
      toast.success('Dream analysis completed!');
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred during dream analysis");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTypingChange = (typing: boolean) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (typing) {
      setIsTyping(true);
    } else {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  const resetForm = () => {
    setDreamResult(null);
    setDreamImages({});
    setIsImageLoading({});
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      {/* Sélecteur de langue en haut à droite */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSelector 
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </div>
      
      {/* Interface centrée */}
      <div className="min-h-screen flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-4xl mx-auto">
          
          {/* Header centré */}
          <header className="z-10 text-center mb-12">
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 dream-text-gradient animate-float">
                DreamForge
              </h1>
              <p className="text-lg text-violet-200/80 max-w-2xl mx-auto mb-6">
                Transform your dreams into mystical narratives and visual art
              </p>
            </div>
          </header>
          
          {/* Contenu principal centré */}
          <main className="z-10 flex flex-col items-center gap-10">
            
            {!dreamResult && (
              <div className="w-full max-w-3xl relative">
                {/* Génie "Interesting..." au-dessus du textarea */}
                {isTyping && (
                  <div className="mb-4">
                    <GenieIndicator />
                  </div>
                )}
                <DreamInput 
                  onSubmit={handleDreamSubmit} 
                  isLoading={isLoading}
                  onTypingChange={handleTypingChange}
                />
              </div>
            )}
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-16 h-16 border-4 border-t-violet-500 border-violet-200/20 rounded-full animate-spin" />
                <p className="mt-4 text-violet-300 animate-pulse">Analyzing your dream...</p>
              </div>
            )}
            
            {dreamResult && !isLoading && (
              <div className="w-full space-y-8">
                {/* Image et résumé */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <DreamAnalysis 
                    result={dreamResult} 
                    section="summary"
                  />
                  <DreamImage 
                    imageUrl={dreamImages.summary}
                    isLoading={isImageLoading.summary}
                    dreamDescription={dreamResult.summary}
                  />
                </div>
                
                {/* Image et analyse psychologique */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <DreamImage 
                    imageUrl={dreamImages.psychological}
                    isLoading={isImageLoading.psychological}
                    dreamDescription="Psychological interpretation"
                  />
                  <DreamAnalysis 
                    result={dreamResult} 
                    section="psychological"
                  />
                </div>
                
                {/* Image et analyse spirituelle */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <DreamAnalysis 
                    result={dreamResult} 
                    section="spiritual"
                  />
                  <DreamImage 
                    imageUrl={dreamImages.spiritual}
                    isLoading={isImageLoading.spiritual}
                    dreamDescription="Spiritual interpretation"
                  />
                </div>
                
                {/* Créature avec image */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                  <DreamImage 
                    imageUrl={dreamImages.creature}
                    isLoading={isImageLoading.creature}
                    dreamDescription={dreamResult.creature.name}
                  />
                  <DreamAnalysis 
                    result={dreamResult} 
                    section="creature"
                  />
                </div>
                
                {/* Analyses restantes */}
                <DreamAnalysis result={dreamResult} section="historical" />
                <DreamAnalysis result={dreamResult} section="ritual" />
                
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={resetForm}
                    className="px-6 py-2 text-sm border border-violet-700/50 rounded-lg hover:bg-violet-900/20 transition-colors"
                  >
                    Analyze another dream
                  </button>
                </div>
              </div>
            )}
          </main>
          
          {/* Footer centré */}
          <footer className="z-10 mt-12 text-center text-sm text-violet-300/50">
            <p>© 2025 DreamForge - Oneiric Experience</p>
            <div className="mt-1 text-xs text-violet-300/30">
              AI Analysis & Vision Active - Explore your dream universe with Gemini
            </div>
          </footer>
          
        </div>
      </div>
    </div>
  );
};

export default Index;
