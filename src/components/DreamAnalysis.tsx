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
  
  interpretationSources?: string[];
  historicalSources?: string[];
  creatureSources?: string[];
  ritualSources?: string[];
}

interface DreamAnalysisProps {
  result: DreamAnalysisResult | null;
  isLoadingInterpretation: boolean;
  isLoadingHistorical: boolean;
  isLoadingCreature: boolean;
  isLoadingRitual: boolean;
  isLoadingReasoning: boolean;
  dreamImages: {[key: string]: string | null};
  isImageLoading: {[key: string]: boolean};
}

const DreamAnalysis: React.FC<DreamAnalysisProps> = ({
  result,
  isLoadingInterpretation,
  isLoadingHistorical,
  isLoadingCreature,
  isLoadingRitual,
  isLoadingReasoning,
  dreamImages,
  isImageLoading
}) => {
  if (!result && !isLoadingInterpretation && !isLoadingHistorical && !isLoadingCreature && !isLoadingRitual && !isLoadingReasoning) {
    return null;
  }

  const interpretationImages = [
    { key: 'interpretation', description: result?.summary || '' },
    { key: 'historical', description: result?.historical.length > 0 ? result.historical[0].interpretation : '' },
    { key: 'creature', description: result?.creature.name || '' },
    { key: 'ritual', description: result?.ritual.title || '' },
  ];

  const renderSources = (sources?: string[]) => {
    if (!sources || sources.length === 0) return null;
    return (
      <div className="mt-4 border-t border-violet-700/30 pt-4">
        <h4 className="text-sm font-medium text-violet-400 mb-2">Sources:</h4>
        <ul className="list-disc list-inside text-white/70 text-sm space-y-1">
          {sources.map((source, index) => (
            <li key={index}>
              <a href={source} target="_blank" rel="noopener noreferrer" className="hover:underline text-violet-300 break-all">
                {source}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <svg className="animate-spin h-8 w-8 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
      </svg>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-center dream-text-gradient mb-8">
        {result?.summary || (isLoadingInterpretation ? 'Loading Dream Title...' : 'Dream Analysis')}
      </h2>

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
              dreamDescription={result?.summary || ''}
            />
            <CardContent className="space-y-6">
              {isLoadingInterpretation ? (
                <LoadingSpinner />
              ) : result ? (
                <>
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

                  {renderSources(result.interpretationSources)}
                </>
              ) : (
                 <p className="text-white/80 text-center">Analysis not available.</p>
              )}
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
              dreamDescription={result?.historical.length > 0 ? result.historical[0].interpretation : ''}
            />
            <CardContent>
              {isLoadingHistorical ? (
                <LoadingSpinner />
              ) : result?.historical && result.historical.length > 0 ? (
                <>
                  <div className="grid gap-6">
                    {result.historical.map((item, index) => (
                      <div key={index} className="border-l-2 border-violet-500/50 pl-4">
                        <h3 className="text-lg font-medium text-violet-300">{item.era}</h3>
                        <p className="text-white/80">{item.interpretation}</p>
                      </div>
                    ))}
                  </div>
                  {renderSources(result.historicalSources)}
                </>
              ) : (
                 <p className="text-white/80 text-center">Historical interpretations not available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="creature">
          <Card className="dream-card overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-violet-800/20 blur-3xl"></div>
            <CardHeader>
              <CardTitle className="dream-text-gradient">
                {isLoadingCreature ? 'Loading...' : result?.creature.name || 'Creature'}
              </CardTitle>
              <CardDescription>Entity generated by your dream</CardDescription>
            </CardHeader>
            <DreamImage
              imageUrl={dreamImages.creature}
              isLoading={isImageLoading.creature}
              dreamDescription={result?.creature.name || ''}
            />
            <CardContent className="space-y-4">
              {isLoadingCreature ? (
                <LoadingSpinner />
              ) : result?.creature && result.creature.name !== 'Unknown' ? (
                <>
                  <div>
                    <h3 className="text-lg font-medium text-violet-300 mb-2">Description</h3>
                    <p className="text-white/80">{result.creature.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-violet-300 mb-2">Characteristics</h3>
                    <p className="text-white/80">{result.creature.characteristics}</p>
                  </div>
                  {renderSources(result.creatureSources)}
                </>
               ) : (
                 <p className="text-white/80 text-center">Creature analysis not available.</p>
               )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ritual">
          <Card className="dream-card">
            <CardHeader>
              <CardTitle>
                 {isLoadingRitual ? 'Loading...' : result?.ritual.title || 'Ritual'}
              </CardTitle>
              <CardDescription>{result?.ritual.objective || ''}</CardDescription>
            </CardHeader>
            <DreamImage
              imageUrl={dreamImages.ritual}
              isLoading={isImageLoading.ritual}
              dreamDescription={result?.ritual.title || ''}
            />
            <CardContent className="space-y-6">
              {isLoadingRitual ? (
                <LoadingSpinner />
              ) : result?.ritual && result.ritual.title !== 'Unknown' ? (
                <>
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
                  {renderSources(result.ritualSources)}
                </>
              ) : (
                 <p className="text-white/80 text-center">Ritual analysis not available.</p>
              )}
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
            {isLoadingReasoning ? (
               <LoadingSpinner />
            ) : result?.reasoning ? (
               <p className="text-xs md:text-sm text-white/60 font-mono">{result.reasoning}</p>
            ) : (
               <p className="text-white/80 text-center">Reasoning not available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DreamAnalysis;
