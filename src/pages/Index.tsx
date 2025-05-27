
import React, { useState } from 'react';
import { toast } from 'sonner';
import StarryBackground from '@/components/StarryBackground';
import DreamInput from '@/components/DreamInput';
import DreamAnalysis, { DreamAnalysisResult } from '@/components/DreamAnalysis';
import DreamImage from '@/components/DreamImage';
import ScholarHead from '@/components/ScholarHead';
import LanguageSelector from '@/components/LanguageSelector';
import { analyzeDream } from '@/services/dreamService';
import { generateDreamImage } from '@/services/imageService';
import TypingIndicator from '@/components/TypingIndicator';

const Index = () => {
  const [dreamResult, setDreamResult] = useState<DreamAnalysisResult | null>(null);
  const [dreamImage, setDreamImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showScholar, setShowScholar] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const handleDreamSubmit = async (dream: string) => {
    try {
      setIsLoading(true);
      setIsImageLoading(true);
      setShowScholar(false);
      
      // Générer l'image et analyser le rêve en parallèle
      const [result, imageUrl] = await Promise.all([
        analyzeDream(dream, selectedLanguage),
        generateDreamImage({ dreamDescription: dream, style: 'surreal' })
      ]);
      
      setDreamResult(result);
      setDreamImage(imageUrl);
      setIsImageLoading(false);
      
      toast.success('Dream analysis completed!');
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred during dream analysis");
      setIsImageLoading(false);
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
      setShowScholar(true);
    } else {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setShowScholar(false);
      }, 2000);
    }
  };

  const resetForm = () => {
    setDreamResult(null);
    setDreamImage(null);
    setShowScholar(false);
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
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
              
              {/* Sélecteur de langue */}
              {!dreamResult && (
                <LanguageSelector 
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                />
              )}
            </div>
          </header>
          
          {/* Contenu principal centré */}
          <main className="z-10 flex flex-col items-center gap-10">
            
            {/* Tête de savant - apparaît pendant la saisie */}
            <ScholarHead isVisible={showScholar && !dreamResult} />
            
            {!dreamResult && (
              <div className="w-full max-w-3xl relative">
                {/* Indicateur "Interesting..." au-dessus du textarea */}
                {isTyping && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
                    <TypingIndicator />
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
            
            {/* Image du rêve */}
            {(dreamImage || isImageLoading) && (
              <DreamImage 
                imageUrl={dreamImage}
                isLoading={isImageLoading}
                dreamDescription={dreamResult?.summary || ''}
              />
            )}
            
            {dreamResult && !isLoading && (
              <div className="w-full">
                <DreamAnalysis result={dreamResult} />
                
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
