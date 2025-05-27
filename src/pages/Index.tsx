import React, { useState } from 'react';
import { toast } from 'sonner';
import StarryBackground from '@/components/StarryBackground';
import DreamInput from '@/components/DreamInput';
import DreamAnalysis, { DreamAnalysisResult } from '@/components/DreamAnalysis';
import LanguageSelector from '@/components/LanguageSelector';
import GenieIndicator from '@/components/GenieIndicator';
import { analyzeDream } from '@/services/dreamService';
import { generateDreamImage } from '@/services/imageService';

const Index = () => {
  const [dreamResult, setDreamResult] = useState<DreamAnalysisResult | null>(null);
  const [dreamImages, setDreamImages] = useState<{[key: string]: string | null}>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<{[key: string]: boolean}>({});
  
  // Add individual loading states for analysis sections
  const [isLoadingInterpretation, setIsLoadingInterpretation] = useState<boolean>(false);
  const [isLoadingHistorical, setIsLoadingHistorical] = useState<boolean>(false);
  const [isLoadingCreature, setIsLoadingCreature] = useState<boolean>(false);
  const [isLoadingRitual, setIsLoadingRitual] = useState<boolean>(false);
  const [isLoadingReasoning, setIsLoadingReasoning] = useState<boolean>(false);

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const handleDreamSubmit = async (dream: string) => {
    try {
      // Set all loading states to true initially
      setIsLoadingInterpretation(true);
      setIsLoadingHistorical(true);
      setIsLoadingCreature(true);
      setIsLoadingRitual(true);
      setIsLoadingReasoning(true);
      setIsLoading(true); // Keep global loading for initial state or remove if not needed

      setDreamResult(null); // Clear previous results
      setDreamImages({});
      setIsImageLoading({});
      
      // NOTE: analyzeDream currently fetches all sections at once.
      // For truly asynchronous section loading, you would need to modify analyzeDream
      // to return promises for each section or expose functions to fetch sections individually.
      // The state updates below are structured as if the data arrives section by section,
      // but the current analyzeDream implementation won't work that way out-of-the-box.
      
      // Assuming analyzeDream is modified to return section data as it's ready:
      const result = await analyzeDream(dream, selectedLanguage);

      // Update states as sections are received (This part needs adjustment based on actual analyzeDream modification)
      // Example (if analyzeDream returned section promises): 
      // result.summaryPromise.then(summary => { setDreamResult(prev => ({...prev, summary})); setIsLoadingInterpretation(false); });
      // ... and so on for other sections.
      
      // As a placeholder with current analyzeDream structure (fetches all at once):
      setDreamResult(result);
      setIsLoadingInterpretation(false);
      setIsLoadingHistorical(false);
      setIsLoadingCreature(false);
      setIsLoadingRitual(false);
      setIsLoadingReasoning(false);

      
      // Générer plusieurs images de façon asynchrone
      const imageKeys = ['interpretation', 'historical', 'creature', 'ritual'];
      const imagePromises = imageKeys.map(async (key) => {
        setIsImageLoading(prev => ({ ...prev, [key]: true }));
        
        let prompt = '';
        switch (key) {
          case 'interpretation':
            prompt = `Visualisation artistique de l'analyse globale du rêve: ${result.summary}`;
            break;
          case 'historical':
            prompt = result.historical.length > 0 ? `Visualisation artistique d'une scène de rêve inspirée par l'interprétation historique (${result.historical[0].era}): ${result.historical[0].interpretation}` : `Visualisation artistique d'une scène de rêve onirique avec une touche historique`;
            break;
          case 'creature':
            prompt = `${result.creature.name}: ${result.creature.description}`;
            break;
          case 'ritual':
            prompt = `${result.ritual.title} (${result.ritual.objective})`;
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
                {/* Rendu unique du composant DreamAnalysis avec les données d'images */}
                <DreamAnalysis
                  result={dreamResult}
                  // Pass individual loading states
                  isLoadingInterpretation={isLoadingInterpretation}
                  isLoadingHistorical={isLoadingHistorical}
                  isLoadingCreature={isLoadingCreature}
                  isLoadingRitual={isLoadingRitual}
                  isLoadingReasoning={isLoadingReasoning}
                  dreamImages={dreamImages}
                  isImageLoading={isImageLoading}
                />

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
