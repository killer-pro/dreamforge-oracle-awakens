
import React, { useState } from 'react';
import { toast } from 'sonner';
import StarryBackground from '@/components/StarryBackground';
import DreamInput from '@/components/DreamInput';
import DreamAnalysis, { DreamAnalysisResult } from '@/components/DreamAnalysis';
import { analyzeDream } from '@/services/dreamService';
import TypingIndicator from '@/components/TypingIndicator';

const Index = () => {
  const [dreamResult, setDreamResult] = useState<DreamAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  const handleDreamSubmit = async (dream: string) => {
    try {
      setIsLoading(true);
      // Analyze with Gemini AI
      const result = await analyzeDream(dream, null);
      setDreamResult(result);
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

  return (
    <div className="min-h-screen flex flex-col relative py-10 px-4 sm:px-6">
      <StarryBackground />
      
      <header className="z-10 text-center mb-10">
        <div className="mb-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 dream-text-gradient animate-float">
            DreamForge
          </h1>
          <p className="text-lg text-violet-200/80 max-w-2xl mx-auto">
            Transform your dreams into mystical narratives
          </p>
        </div>
      </header>
      
      <main className="z-10 flex-grow flex flex-col items-center gap-10">
        {!dreamResult && (
          <div className="w-full max-w-4xl">
            {isTyping && (
              <div className="flex justify-center mb-4">
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
        
        {dreamResult && !isLoading && (
          <div className="w-full">
            <DreamAnalysis result={dreamResult} />
            
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setDreamResult(null)}
                className="px-6 py-2 text-sm border border-violet-700/50 rounded-lg hover:bg-violet-900/20 transition-colors"
              >
                Analyze another dream
              </button>
            </div>
          </div>
        )}
      </main>
      
      <footer className="z-10 mt-12 text-center text-sm text-violet-300/50">
        <p>© 2025 DreamForge - Oneiric Experience</p>
        <div className="mt-1 text-xs text-violet-300/30">
          AI Analysis Active - Explore your dream universe with Gemini
        </div>
      </footer>
    </div>
  );
};

export default Index;
