
import React, { useState } from 'react';
import { DreamInput } from '@/components/DreamInput';
import { DreamAnalysis } from '@/components/DreamAnalysis';
import { Header } from '@/components/Header';
import { ApiKeyInput } from '@/components/ApiKeyInput';

const Index = () => {
  const [dreamText, setDreamText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleDreamSubmit = async (dream: string) => {
    setDreamText(dream);
    setIsLoading(true);
    
    try {
      if (isDemoMode || !apiKey) {
        // Demo mode with sample analysis
        const demoAnalysis = generateDemoAnalysis(dream);
        setAnalysis(demoAnalysis);
      } else {
        // Real API call would go here
        console.log('Calling Sonar API with:', { dream, apiKey });
        // For now, fallback to demo
        const demoAnalysis = generateDemoAnalysis(dream);
        setAnalysis(demoAnalysis);
      }
    } catch (error) {
      console.error('Error analyzing dream:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoAnalysis = (dream: string) => {
    return {
      psychological: "Your dream reflects deep subconscious processing of daily experiences. From a Jungian perspective, this suggests integration of your shadow self and anima/animus archetypes.",
      spiritual: "The symbols in your dream point toward spiritual awakening and connection with higher consciousness. This vision may be guiding you toward inner wisdom.",
      rational: "Dreams often process memories and emotions from recent experiences. Your dream likely combines fragments of recent events with emotional processing.",
      historical: "In ancient Egyptian tradition, such dreams were considered messages from the gods. Native American cultures would view this as a vision quest experience.",
      creature: {
        name: "Luminar Sphinx",
        description: "A mystical creature with the body of a lion, wings of an eagle, and eyes that hold the wisdom of ages. It represents the guardian of your inner knowledge.",
        symbolism: "Protection, wisdom, and the bridge between conscious and unconscious realms."
      },
      ritual: {
        name: "Moonlight Reflection Ceremony",
        description: "Light a white candle at midnight and meditate on your dream imagery for 15 minutes while holding a piece of amethyst.",
        meaning: "This ritual helps integrate dream wisdom into waking consciousness and strengthens dream recall abilities."
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Cosmic background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="stars" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"%3E%3Ccircle cx="25" cy="25" r="1" fill="white" opacity="0.3"/%3E%3Ccircle cx="75" cy="75" r="0.5" fill="white" opacity="0.5"/%3E%3Ccircle cx="50" cy="80" r="0.8" fill="white" opacity="0.4"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23stars)"/%3E%3C/svg%3E')] animate-pulse"></div>
      
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                Welcome to DreamForge
              </h1>
              <p className="text-lg text-purple-200 max-w-2xl mx-auto">
                Unlock the mysteries of your dreams through psychological, spiritual, and historical interpretations. 
                Discover symbolic creatures and meaningful rituals born from your subconscious.
              </p>
            </div>

            {!apiKey && !isDemoMode && (
              <ApiKeyInput 
                onApiKeySet={setApiKey}
                onDemoMode={() => setIsDemoMode(true)}
              />
            )}

            {(apiKey || isDemoMode) && (
              <DreamInput 
                onSubmit={handleDreamSubmit}
                isLoading={isLoading}
              />
            )}

            {analysis && (
              <DreamAnalysis 
                analysis={analysis}
                dreamText={dreamText}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
