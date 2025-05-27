
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ApiKeyInputProps {
  onApiKeySubmit: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('perplexityApiKey', apiKey.trim());
      onApiKeySubmit(apiKey.trim());
      setShowDialog(false);
      toast.success("Clé API sauvegardée avec succès");
    }
  };

  // Use the stored API key if available
  React.useEffect(() => {
    const storedKey = localStorage.getItem('perplexityApiKey');
    if (storedKey) {
      setApiKey(storedKey);
      onApiKeySubmit(storedKey);
    }
  }, [onApiKeySubmit]);

  return (
    <>
      <Button 
        onClick={() => setShowDialog(true)} 
        variant="outline" 
        className="dream-button text-xs px-3 py-1 h-auto"
      >
        Configurer API
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="dream-card sm:max-w-md border-violet-800/30">
          <DialogHeader>
            <DialogTitle className="text-center text-lg sm:text-xl dream-text-gradient">
              Configuration de l'API
            </DialogTitle>
            <DialogDescription className="text-center">
              Pour utiliser l'analyse avancée, ajoutez votre clé API Perplexity
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="dream-input"
              placeholder="pk-..."
              required
            />
            <DialogFooter>
              <Button type="submit" className="dream-button w-full">
                Sauvegarder
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiKeyInput;
