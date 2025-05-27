
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Wand2 } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: (key: string) => void;
  onDemoMode: () => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet, onDemoMode }) => {
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim()) {
      onApiKeySet(inputKey.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-purple-200 flex items-center justify-center gap-2">
            <Key className="w-5 h-5" />
            API Configuration
          </CardTitle>
          <CardDescription className="text-purple-300">
            Enter your Sonar API key or try demo mode
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="password"
              placeholder="Enter your Sonar API key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="bg-purple-900/20 border-purple-500/30 text-purple-100 placeholder-purple-400"
            />
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={!inputKey.trim()}
            >
              Connect API
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-purple-500/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black/20 px-2 text-purple-400">Or</span>
            </div>
          </div>

          <Button 
            onClick={onDemoMode}
            variant="outline"
            className="w-full border-purple-500/30 text-purple-200 hover:bg-purple-500/20"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Try Demo Mode
          </Button>
          
          <p className="text-xs text-purple-400 text-center">
            Demo mode provides sample interpretations for testing
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
