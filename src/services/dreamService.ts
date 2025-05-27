import { DreamAnalysisResult } from "@/components/DreamAnalysis";

const SONAR_API_KEY = import.meta.env.VITE_SONAR_API_KEY;
const SONAR_API_URL = import.meta.env.VITE_SONAR_API_URL;

// Helper function to call Gemini API with a specific prompt
async function callGeminiApi<T>(prompt: string, apiKey: string, apiUrl: string): Promise<T> {
  const response = await fetch(`${apiUrl}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Gemini API error:', error);
    throw new Error(error.message || 'Error during API call');
  }

  const data = await response.json();

  try {
    const content = data.candidates[0].content.parts[0].text;
    console.log('Gemini response part:', content);

    // Clean up the response to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in API response part:', content);
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]) as T;
  } catch (e) {
    console.error('Failed to parse Gemini response part:', e, 'Raw content:', data.candidates?.[0]?.content?.parts?.[0]?.text);
    throw new Error('Failed to parse API response');
  }
}

// Define interfaces for expected API responses per section
interface SummaryApiResponse { summary: string; sources?: string[]; }
interface InterpretationApiResponse { psychological: string; spiritual: string; rational: string; sources?: string[]; }
interface HistoricalApiResponse { historical: { era: string; interpretation: string; }[]; sources?: string[]; }
interface CreatureApiResponse { creature: { name: string; description: string; characteristics: string; }; sources?: string[]; }
interface RitualApiResponse { ritual: { title: string; objective: string; materials: string; steps: string; justification: string; }; sources?: string[]; }
interface ReasoningApiResponse { reasoning: string; sources?: string[]; }

export async function analyzeDream(dream: string, language: string = 'en'): Promise<DreamAnalysisResult> {
  // Use Gemini API if available
  if (SONAR_API_KEY) {
    try {
      const languagePrompts = {
        en: {
          summary: 'Provide a 1-2 sentence summary of the following dream. Include sources if possible. Respond strictly in English in the JSON format: { "summary": "...", "sources": ["url1", "..."] } ',
          interpretation: 'Analyze the following dream from psychological (Jungian, Freudian, etc.) and spiritual perspectives, and provide a rational explanation. Include sources if possible. Respond strictly in English in the JSON format: { "psychological": "...", "spiritual": "...", "rational": "...", "sources": ["url1", "..."] } ',
          historical: 'Provide 3 historical or cultural interpretations of the following dream. Include sources if possible. Respond strictly in English in the JSON format: { "historical": [ { "era": "...", "interpretation": "..." } ], "sources": ["url1", "..."] } ',
          creature: 'Identify and describe any mythical or symbolic creature/entity related to the following dream. Include sources if possible. Respond strictly in English in the JSON format: { "creature": { "name": "...", "description": "...", "characteristics": "..." }, "sources": ["url1", "..."] } ',
          ritual: 'Suggest a symbolic ritual or practice related to the following dream, including objective, materials, steps, and justification. Include sources if possible. Respond strictly in English in the JSON format: { "ritual": { "title": "...", "objective": "...", "materials": "...", "steps": "...", "justification": "..." }, "sources": ["url1", "..."] } ',
          reasoning: 'Provide a brief overall reasoning for the dream analysis. Include sources if possible. Respond strictly in English in the JSON format: { "reasoning": "...", "sources": ["url1", "..."] } ',
        },
        fr: {
          summary: 'Fournissez un résumé en 1-2 phrases du rêve suivant. Incluez les sources si possible. Répondez strictement en français au format JSON : { "summary": "...", "sources": ["url1", "..."] } ',
          interpretation: 'Analysez le rêve suivant d\'un point de vue psychologique (Jungien, Freudien, etc.) et spirituel, et fournissez une explication rationnelle. Incluez les sources si possible. Répondez strictement en français au format JSON : { "psychological": "...", "spiritual": "...", "rational": "...", "sources": ["url1", "..."] } ',
          historical: 'Fournissez 3 interprétations historiques ou culturelles du rêve suivant. Incluez les sources si possible. Répondez strictement en français au format JSON : { "historical": [ { "era": "...", "interpretation": "..." } ], "sources": ["url1", "..."] } ',
          creature: 'Identifiez et décrivez toute créature/entité mythique ou symbolique liée au rêve suivant. Incluez les sources si possible. Répondez strictement en français au format JSON : { "creature": { "name": "...", "description": "...", "characteristics": "..." }, "sources": ["url1", "..."] } ',
          ritual: 'Suggérez un rituel ou une pratique symbolique liée au rêve suivant, incluant l\'objectif, les matériaux, les étapes et la justification. Incluez les sources si possible. Répondez strictement en français au format JSON : { "ritual": { "title": "...", "objective": "...", "materials": "...", "steps": "...", "justification": "..." }, "sources": ["url1", "..."] } ',
          reasoning: 'Fournissez un bref raisonnement global pour l\'analyse du rêve. Incluez les sources si possible. Répondez strictement en français au format JSON : { "reasoning": "...", "sources": ["url1", "..."] } ',
        },
        // Add other languages here
      };

      const prompts = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.en;

      const summaryResult = await callGeminiApi<SummaryApiResponse>(`${prompts.summary}: "${dream}"`, SONAR_API_KEY, SONAR_API_URL);
      const interpretationResult = await callGeminiApi<InterpretationApiResponse>(`${prompts.interpretation}: "${dream}"`, SONAR_API_KEY, SONAR_API_URL);
      const historicalResult = await callGeminiApi<HistoricalApiResponse>(`${prompts.historical}: "${dream}"`, SONAR_API_KEY, SONAR_API_URL);
      const creatureResult = await callGeminiApi<CreatureApiResponse>(`${prompts.creature}: "${dream}"`, SONAR_API_KEY, SONAR_API_URL);
      const ritualResult = await callGeminiApi<RitualApiResponse>(`${prompts.ritual}: "${dream}"`, SONAR_API_KEY, SONAR_API_URL);
      const reasoningResult = await callGeminiApi<ReasoningApiResponse>(`${prompts.reasoning}: "${dream}"`, SONAR_API_KEY, SONAR_API_URL);

      const fullResult: DreamAnalysisResult = {
        summary: summaryResult.summary || 'No summary generated.',
        psychological: interpretationResult.psychological || 'No psychological interpretation generated.',
        spiritual: interpretationResult.spiritual || 'No spiritual interpretation generated.',
        rational: interpretationResult.rational || 'No rational explanation generated.',
        historical: historicalResult.historical || [],
        creature: creatureResult.creature || { name: 'Unknown', description: 'N/A', characteristics: 'N/A' },
        ritual: ritualResult.ritual || { title: 'Unknown', objective: 'N/A', materials: 'N/A', steps: 'N/A', justification: 'N/A' },
        reasoning: reasoningResult.reasoning || 'No reasoning provided.',
        interpretationSources: interpretationResult.sources || [],
        historicalSources: historicalResult.sources || [],
        creatureSources: creatureResult.sources || [],
        ritualSources: ritualResult.sources || [],
      };

      return fullResult;

    } catch (error) {
      console.error('Error analyzing dream with Gemini API (section calls):', error);
      // Fallback to demo mode if any API call fails
      return generateDemoAnalysis(dream, language);
    }
  }

  // Fallback to demo mode if no API key
  return generateDemoAnalysis(dream, language);
}

function generateDemoAnalysis(dream: string, language: string = 'en'): DreamAnalysisResult {
  // Extract keywords from dream for demo personalization
  const dreamLower = dream.toLowerCase();

  // Detection of some common themes
  const hasWater = dreamLower.includes('water') || dreamLower.includes('sea') || dreamLower.includes('ocean') || dreamLower.includes('river');
  // const hasFlying = dreamLower.includes('fly') || dreamLower.includes('flying') || dreamLower.includes('sky');
  // const hasFalling = dreamLower.includes('fall') || dreamLower.includes('falling');
  // const hasAnimal = dreamLower.includes('animal') || dreamLower.includes('cat') || dreamLower.includes('dog') || dreamLower.includes('bird');

  // Localized content based on language
  interface LocalizedDemoContent {
    creatureName: string;
    creatureDesc: string;
    ritualName: string;
    summary: string;
    psychological: string;
    spiritual: string;
    rational: string;
    reasoning: string;
    historicalInterpretations: { era: string; interpretation: string; }[];
    ritualObjective: string;
    ritualMaterials: string;
    ritualSteps: string;
    ritualJustification: string;
  }

  const localizedContent: { [key: string]: LocalizedDemoContent } = {
    en: {
      creatureName: "The Oneirosopher",
      creatureDesc: "A mystical being that traverses dreams and helps understand them",
      ritualName: "Ritual of Oneiric Clarity",
      summary: `Your dream "${dream.slice(0, 50)}${dream.length > 50 ? '...' : ''}" reveals fascinating aspects of your unconscious mind.`,
      psychological: "From a Jungian perspective, this dream could represent the integration of contradictory aspects of your personality. The symbols present suggest an ongoing individuation process.",
      spiritual: "In a spiritual reading, this dream symbolizes a connection with universal energies that seek to guide you toward a deeper understanding of your life path.",
      rational: "This dream could be influenced by recent stimuli from your daily life, combined with latent concerns and natural processing of emotions during sleep.",
      reasoning: "This interpretation is based on universal archetypes present in many cultures and psychological theories that recognize dreams as symbolic expressions of our unconscious.",
      historicalInterpretations: [
        {
          era: "Ancient Egypt",
          interpretation:
            "Egyptian priests would have seen in this dream a message from the gods, particularly related to the concept of Ka and Ba, the different parts of the soul."
        },
        {
          era: "European Middle Ages",
          interpretation:
            "This dream would have been considered a prophetic vision or divine warning, perhaps related to your personal destiny."
        },
        {
          era: "Native American culture",
          interpretation:
            "Shamans would have interpreted this dream as an encounter with an animal spirit or spiritual guide seeking to transmit ancestral wisdom."
        }
      ],
      ritualObjective:
        "Strengthen the messages of this dream and facilitate your personal development",
      ritualMaterials:
        "A dream journal, a violet candle, a personal object related to the dream theme",
      ritualSteps:
        "1. Before sleeping, write your intention to understand this dream more deeply\n2. Meditate for 5 minutes on the main symbols of the dream\n3. Place the chosen object under your pillow\n4. Upon waking, immediately note any new perspective",
      ritualJustification:
        "This ritual combines elements of Jungian psychology (focus on symbols), mindfulness (meditation), and cognitive priming (intention before sleep)."
    },
    fr: {
      creatureName: "L'Oneirosophe",
      creatureDesc: "Un être mystique qui traverse les rêves et aide à les comprendre",
      ritualName: "Rituel de Clarté Onirique",
      summary: `Votre rêve "${dream.slice(0, 50)}${dream.length > 50 ? '...' : ''}" révèle des aspects fascinants de votre esprit inconscient.`, 
      psychological: "D'un point de vue jungien, ce rêve pourrait représenter l'intégration d'aspects contradictoires de votre personnalité. Les symboles présents suggèrent un processus d'individuation en cours.",
      spiritual: "Dans une lecture spirituelle, ce rêve symbolise une connexion avec les énergies universelles qui cherchent à vous guider vers une compréhension plus profonde de votre chemin de vie.",
      rational: "Ce rêve pourrait être influencé par des stimuli récents de votre vie quotidienne, combinés à des préoccupations latentes et au traitement naturel des émotions pendant le sommeil.",
      reasoning:
        "Cette interprétation est basée sur des archétypes universels présents dans de nombreuses cultures et des théories psychologiques qui reconnaissent les rêves comme des expressions symboliques de notre inconscient.",
      historicalInterpretations: [
        {
          era: "Égypte Antique",
          interpretation:
            "Les prêtres égyptiens auraient vu dans ce rêve un message des dieux, particulièrement lié au concept de Ka et Ba, les différentes parties de l'âme."
        },
        {
          era: "Moyen Âge Européen",
          interpretation:
            "Ce rêve aurait été considéré comme une vision prophétique ou un avertissement divin, peut-être lié à votre destinée personnelle."
        },
        {
          era: "Culture Amérindienne",
          interpretation:
            "Les chamans auraient interprété ce rêve comme une rencontre avec un esprit animal ou un guide spirituel cherchant à transmettre une sagesse ancestrale."
        }
      ],
      ritualObjective:
        "Renforcer les messages de ce rêve et faciliter votre développement personnel",
      ritualMaterials:
        "Un carnet de rêves, une bougie violette, un objet personnel lié au thème du rêve",
      ritualSteps:
        "1. Avant de dormir, écrivez votre intention de comprendre ce rêve plus profondément\n2. Méditez 5 minutes sur les symboles principaux du rêve\n3. Placez l'objet choisi sous votre oreiller\n4. Au réveil, notez immédiatement toute nouvelle perspective",
      ritualJustification:
        "Ce rituel combine des éléments de psychologie jungienne (focus sur les symboles), de pleine conscience (méditation), et d'amorçage cognitif (intention avant le sommeil)."
    }
    // Add other languages here
  };

  const content = localizedContent[language as keyof typeof localizedContent] || localizedContent.en;

  // Creation of personalized analysis based on keywords
  let creatureName = content.creatureName;
  let creatureDesc = content.creatureDesc;
  let ritualName = content.ritualName;

  if (hasWater) {
    creatureName = language === 'fr' ? "L'Ondine Psychique" : "The Psychic Undine";
    creatureDesc = language === 'fr' ? "Une entité aquatique qui navigue dans les profondeurs de l'inconscient" : "An aquatic entity that navigates the depths of the unconscious";
    ritualName = language === 'fr' ? "Rituel d'Immersion Réflective" : "Ritual of Reflective Immersion";
  }

  return {
    summary: content.summary,
    psychological: content.psychological,
    spiritual: content.spiritual,
    rational: content.rational,
    historical: content.historicalInterpretations,
    creature: {
      name: creatureName,
      description: creatureDesc,
      characteristics: language === 'fr'
        ? "Capable de transformer les symboles oniriques en sagesse pratique, cette entité sert de pont entre le conscient et l'inconscient."
        : "Capable of transforming oneiric symbols into practical wisdom, this entity serves as a bridge between the conscious and unconscious.",
    },
    ritual: {
      title: ritualName,
      objective: content.ritualObjective,
      materials: content.ritualMaterials,
      steps: content.ritualSteps,
      justification: content.ritualJustification,
    },
    reasoning: content.reasoning,

    // Add placeholder sources for the demo
    interpretationSources: ['https://example.com/psycho-source', 'https://example.com/spirit-source'],
    historicalSources: ['https://example.com/history-source1', 'https://example.com/history-source2'],
    creatureSources: ['https://example.com/creature-source'],
    ritualSources: ['https://example.com/ritual-source'],
  };
}
