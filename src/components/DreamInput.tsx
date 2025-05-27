import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface DreamInputProps {
  onSubmit: (dream: string) => void;
  isLoading: boolean;
  onTypingChange: (isTyping: boolean) => void;
}

const DreamInput: React.FC<DreamInputProps> = ({ onSubmit, isLoading, onTypingChange }) => {
  const [dream, setDream] = useState('');
  
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDream(event.target.value);
    onTypingChange(event.target.value.length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dream.trim().length > 0) {
      onSubmit(dream);
    }
  };

  const examples = [
    "I dreamed I was flying over a golden city",
    "I spoke with an octopus wearing a tuxedo",
    "I was falling into a bottomless pit filled with stars"
  ];

  const handleExampleClick = (example: string) => {
    setDream(example);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Textarea
            value={dream}
            onChange={handleInputChange}
            className="dream-input min-h-[120px] transition-all focus:min-h-[160px]"
            placeholder="Describe your dream here..."
            required
          />
          <div className="absolute -bottom-3 -right-3 transform rotate-6 hidden md:block">
            <Sparkles className="w-8 h-8 text-violet-400 animate-pulse" />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-2">
          <div className="text-xs text-violet-300/70 flex flex-wrap gap-2">
            <span className="mr-1">Examples:</span>
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                className="px-2 py-1 bg-violet-900/30 rounded-md hover:bg-violet-900/50 transition-colors text-violet-300"
                onClick={() => handleExampleClick(example)}
              >
                {example}
              </button>
            ))}
          </div>
          
          <Button 
            type="submit" 
            className="dream-button group"
            disabled={isLoading || dream.trim().length === 0}
          >
            {isLoading ? 'Analyzing...' : 'Explore my dream'}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DreamInput;
