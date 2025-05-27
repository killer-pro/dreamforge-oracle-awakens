
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Sparkles, Lightbulb, Clock, Crown, Flame } from 'lucide-react';

interface Analysis {
  psychological: string;
  spiritual: string;
  rational: string;
  historical: string;
  creature: {
    name: string;
    description: string;
    symbolism: string;
  };
  ritual: {
    name: string;
    description: string;
    meaning: string;
  };
}

interface DreamAnalysisProps {
  analysis: Analysis;
  dreamText: string;
}

export const DreamAnalysis: React.FC<DreamAnalysisProps> = ({ analysis, dreamText }) => {
  return (
    <div className="space-y-6">
      {/* Dream Summary */}
      <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-purple-200">Your Dream</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-purple-100 italic leading-relaxed">"{dreamText}"</p>
        </CardContent>
      </Card>

      {/* Analysis Tabs */}
      <Tabs defaultValue="psychological" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/20 border-purple-500/30">
          <TabsTrigger value="psychological" className="text-purple-200">
            <Brain className="w-4 h-4 mr-2" />
            Psychological
          </TabsTrigger>
          <TabsTrigger value="spiritual" className="text-purple-200">
            <Sparkles className="w-4 h-4 mr-2" />
            Spiritual
          </TabsTrigger>
          <TabsTrigger value="rational" className="text-purple-200">
            <Lightbulb className="w-4 h-4 mr-2" />
            Rational
          </TabsTrigger>
          <TabsTrigger value="historical" className="text-purple-200">
            <Clock className="w-4 h-4 mr-2" />
            Historical
          </TabsTrigger>
        </TabsList>

        <TabsContent value="psychological">
          <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-200 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Psychological Analysis
              </CardTitle>
              <CardDescription className="text-purple-300">
                Freudian and Jungian perspectives on your dream
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100 leading-relaxed">{analysis.psychological}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spiritual">
          <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-200 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Spiritual Interpretation
              </CardTitle>
              <CardDescription className="text-purple-300">
                Symbolic and metaphysical meanings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100 leading-relaxed">{analysis.spiritual}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rational">
          <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-200 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Rational Explanation
              </CardTitle>
              <CardDescription className="text-purple-300">
                Scientific and cognitive perspectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100 leading-relaxed">{analysis.rational}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historical">
          <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-200 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Historical Context
              </CardTitle>
              <CardDescription className="text-purple-300">
                Ancient wisdom and cultural interpretations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100 leading-relaxed">{analysis.historical}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Creature and Ritual Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-purple-200 flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Dream Creature
            </CardTitle>
            <CardDescription className="text-purple-300">
              Your symbolic guardian spirit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Badge variant="outline" className="border-purple-500/30 text-purple-200 mb-2">
                {analysis.creature.name}
              </Badge>
              <p className="text-purple-100 text-sm leading-relaxed">
                {analysis.creature.description}
              </p>
            </div>
            <div>
              <h4 className="text-purple-200 font-medium mb-1">Symbolism:</h4>
              <p className="text-purple-100 text-sm">{analysis.creature.symbolism}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-purple-200 flex items-center gap-2">
              <Flame className="w-5 h-5" />
              Dream Ritual
            </CardTitle>
            <CardDescription className="text-purple-300">
              Ceremony to honor your dream
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Badge variant="outline" className="border-purple-500/30 text-purple-200 mb-2">
                {analysis.ritual.name}
              </Badge>
              <p className="text-purple-100 text-sm leading-relaxed">
                {analysis.ritual.description}
              </p>
            </div>
            <div>
              <h4 className="text-purple-200 font-medium mb-1">Meaning:</h4>
              <p className="text-purple-100 text-sm">{analysis.ritual.meaning}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
