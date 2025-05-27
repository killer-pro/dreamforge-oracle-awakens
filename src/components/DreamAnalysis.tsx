import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Clock, Star, Wand } from 'lucide-react';
import DreamImage from './DreamImage';

export interface DreamAnalysisResult {
  summary: string;
  psychological: string;
  spiritual: string;
  rational: string;
  historical: {
    era: string;
    interpretation: string;
  }[];
  creature: {
    name: string;
    description: string;
    characteristics: string;
  };
  ritual: {
    title: string;
    objective: string;
    materials: string;
    steps: string;
    justification: string;
  };
  reasoning: string;
}

interface DreamAnalysisProps {
  result: DreamAnalysisResult | null;
  dreamImages: {[key: string]: string | null};
  isImageLoading: {[key: string]: boolean};
}

const DreamAnalysis: React.FC<DreamAnalysisProps> = ({ result, dreamImages, isImageLoading }) => {
  if (!result) return null;
  
  const interpretationImages = [
    { key: 'summary', description: result.summary },
    { key: 'psychological', description: 'Psychological interpretation' },
    { key: 'spiritual', description: 'Spiritual interpretation' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <Tabs defaultValue="interpretation" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="interpretation" className="flex items-center gap-2">
            <Book className="h-4 w-4" />
            <span className="hidden md:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="historical" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden md:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="creature" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden md:inline">Creature</span>
          </TabsTrigger>
          <TabsTrigger value="ritual" className="flex items-center gap-2">
            <Wand className="h-4 w-4" />
            <span className="hidden md:inline">Ritual</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="interpretation" className="space-y-6">
          <Card className="dream-card">
            <CardHeader>
              <CardTitle>Analysis of your dream</CardTitle>
              <CardDescription>Psychological and spiritual interpretation</CardDescription>
            </CardHeader>
            <DreamImage
              imageUrl={dreamImages.interpretation}
              isLoading={isImageLoading.interpretation}
              dreamDescription={result.summary}
            />
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-violet-300 mb-2">Summary</h3>
                <p className="text-white/80">{result.summary}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-violet-300">Psychological interpretation</h3>
                  <p className="text-white/80">{result.psychological}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-violet-300">Spiritual interpretation</h3>
                  <p className="text-white/80">{result.spiritual}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-violet-300 mb-2">Rational explanation</h3>
                <p className="text-white/80">{result.rational}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historical">
          <Card className="dream-card">
            <CardHeader>
              <CardTitle>Historical interpretation</CardTitle>
              <CardDescription>Meaning throughout the ages</CardDescription>
            </CardHeader>
            <DreamImage
              imageUrl={dreamImages.historical}
              isLoading={isImageLoading.historical}
              dreamDescription={result.historical.length > 0 ? result.historical[0].interpretation : 'Historical interpretation'}
            />
            <CardContent>
              <div className="grid gap-6">
                {result.historical.map((item, index) => (
                  <div key={index} className="border-l-2 border-violet-500/50 pl-4">
                    <h3 className="text-lg font-medium text-violet-300">{item.era}</h3>
                    <p className="text-white/80">{item.interpretation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="creature">
          <Card className="dream-card overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-violet-800/20 blur-3xl"></div>
            <CardHeader>
              <CardTitle className="dream-text-gradient">{result.creature.name}</CardTitle>
              <CardDescription>Entity generated by your dream</CardDescription>
            </CardHeader>
            <DreamImage
              imageUrl={dreamImages.creature}
              isLoading={isImageLoading.creature}
              dreamDescription={result.creature.name}
            />
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-violet-300 mb-2">Description</h3>
                <p className="text-white/80">{result.creature.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-violet-300 mb-2">Characteristics</h3>
                <p className="text-white/80">{result.creature.characteristics}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ritual">
          <Card className="dream-card">
            <CardHeader>
              <CardTitle>{result.ritual.title}</CardTitle>
              <CardDescription>{result.ritual.objective}</CardDescription>
            </CardHeader>
            <DreamImage
              imageUrl={dreamImages.ritual}
              isLoading={isImageLoading.ritual}
              dreamDescription={result.ritual.title}
            />
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-violet-300 mb-2">Required materials</h3>
                <p className="text-white/80">{result.ritual.materials}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-violet-300 mb-2">Steps</h3>
                <p className="text-white/80">{result.ritual.steps}</p>
              </div>
              
              <div className="bg-violet-900/30 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-violet-300 mb-2">Justification</h3>
                <p className="text-white/80">{result.ritual.justification}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12">
        <Card className="dream-card border-dashed border-violet-800/50">
          <CardHeader>
            <CardTitle className="text-sm">Chain of reasoning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs md:text-sm text-white/60 font-mono">{result.reasoning}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DreamAnalysis;
