
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Loader2 } from 'lucide-react';

interface DreamInputProps {
  onSubmit: (dream: string) => void;
  isLoading: boolean;
}

export const DreamInput: React.FC<DreamInputProps> = ({ onSubmit, isLoading }) => {
  const [dreamText, setDreamText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dreamText.trim() && !isLoading) {
      onSubmit(dreamText.trim());
    }
  };

  return (
    <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-purple-200 flex items-center justify-center gap-2">
          <Brain className="w-6 h-6" />
          Share Your Dream
        </CardTitle>
        <CardDescription className="text-purple-300">
          Describe your dream in as much detail as you remember
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="I dreamed that I was flying over a vast ocean under a starlit sky..."
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            className="min-h-32 bg-purple-900/20 border-purple-500/30 text-purple-100 placeholder-purple-400 resize-none"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
            disabled={!dreamText.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Interpreting Dream...
              </>
            ) : (
              'Interpret My Dream'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
