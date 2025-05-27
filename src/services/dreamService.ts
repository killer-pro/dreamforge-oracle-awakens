
import { DreamAnalysisResult } from "@/components/DreamAnalysis";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function analyzeDream(dream: string, language: string = 'en'): Promise<DreamAnalysisResult> {
  // Use Gemini API if available
  if (GEMINI_API_KEY) {
    try {
      const languagePrompts = {
        en: 'Analyze the following dream and respond strictly in English in the JSON format specified below',
        fr: 'Analysez le rêve suivant et répondez strictement en français dans le format JSON spécifié ci-dessous',
        es: 'Analiza el siguiente sueño y responde estrictamente en español en el formato JSON especificado a continuación',
        de: 'Analysiere den folgenden Traum und antworte strikt auf Deutsch im unten angegebenen JSON-Format',
        it: 'Analizza il seguente sogno e rispondi rigorosamente in italiano nel formato JSON specificato di seguito'
      };

      const prompt = `
${languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.en}:
"${dream}"

JSON response format:
{
  "summary": "Dream summary in 1-2 sentences",
  "psychological": "Psychological interpretation (Jungian, Freudian, etc. perspective)",
  "spiritual": "Spiritual or esoteric interpretation",
  "rational": "Possible rational explanation",
  "historical": [
    {
      "era": "Name of era or culture",
      "interpretation": "Interpretation according to this era"
    },
    {
      "era": "Name of era or culture", 
      "interpretation": "Interpretation according to this era"
    },
    {
      "era": "Name of era or culture",
      "interpretation": "Interpretation according to this era"
    }
  ],
  "creature": {
    "name": "Name of the creature/entity",
    "description": "Detailed description",
    "characteristics": "Special characteristics"
  },
  "ritual": {
    "title": "Name of the ritual",
    "objective": "Objective of the ritual",
    "materials": "Required materials",
    "steps": "Steps to follow",
    "justification": "Justification based on traditions or psychology"
  },
  "reasoning": "Detailed explanation of the reasoning that led to these conclusions"
}

Use your reasoning and research to provide interesting and creative interpretations, but based on cultural references or psychological theories. Respond ONLY with the JSON, without text before or after.
`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
          ]
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Gemini API error:', error);
        throw new Error(error.message || 'Error during dream analysis');
      }

      const data = await response.json();
      let result: DreamAnalysisResult;

      try {
        // Extract content from Gemini response
        const content = data.candidates[0].content.parts[0].text;
        console.log('Gemini response:', content);
        
        // Clean up the response to extract JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        
        result = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('Failed to parse Gemini response:', e);
        // Fallback to demo mode if parsing fails
        return generateDemoAnalysis(dream, language);
      }

      return result;
    } catch (error) {
      console.error('Error analyzing dream with Gemini API:', error);
      // Fallback to demo mode if API fails
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
  const hasFlying = dreamLower.includes('fly') || dreamLower.includes('flying') || dreamLower.includes('sky');
  const hasFalling = dreamLower.includes('fall') || dreamLower.includes('falling');
  const hasAnimal = dreamLower.includes('animal') || dreamLower.includes('cat') || dreamLower.includes('dog') || dreamLower.includes('bird');
  
  // Localized content based on language
  const localizedContent = {
    en: {
      creatureName: "The Oneirosopher",
      creatureDesc: "A mystical being that traverses dreams and helps understand them",
      ritualName: "Ritual of Oneiric Clarity",
      summary: `Your dream "${dream.slice(0, 50)}${dream.length > 50 ? '...' : ''}" reveals fascinating aspects of your unconscious mind.`,
      psychological: "From a Jungian perspective, this dream could represent the integration of contradictory aspects of your personality. The symbols present suggest an ongoing individuation process.",
      spiritual: "In a spiritual reading, this dream symbolizes a connection with universal energies that seek to guide you toward a deeper understanding of your life path.",
      rational: "This dream could be influenced by recent stimuli from your daily life, combined with latent concerns and natural processing of emotions during sleep."
    },
    fr: {
      creatureName: "L'Oneirosophe",
      creatureDesc: "Un être mystique qui traverse les rêves et aide à les comprendre",
      ritualName: "Rituel de Clarté Onirique",
      summary: `Votre rêve "${dream.slice(0, 50)}${dream.length > 50 ? '...' : ''}" révèle des aspects fascinants de votre esprit inconscient.`,
      psychological: "D'un point de vue jungien, ce rêve pourrait représenter l'intégration d'aspects contradictoires de votre personnalité. Les symboles présents suggèrent un processus d'individuation en cours.",
      spiritual: "Dans une lecture spirituelle, ce rêve symbolise une connexion avec les énergies universelles qui cherchent à vous guider vers une compréhension plus profonde de votre chemin de vie.",
      rational: "Ce rêve pourrait être influencé par des stimuli récents de votre vie quotidienne, combinés à des préoccupations latentes et au traitement naturel des émotions pendant le sommeil."
    }
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
    historical: [
      {
        era: language === 'fr' ? "Égypte Antique" : "Ancient Egypt",
        interpretation: language === 'fr' ? 
          "Les prêtres égyptiens auraient vu dans ce rêve un message des dieux, particulièrement lié au concept de Ka et Ba, les différentes parties de l'âme." :
          "Egyptian priests would have seen in this dream a message from the gods, particularly related to the concept of Ka and Ba, the different parts of the soul."
      },
      {
        era: language === 'fr' ? "Moyen Âge Européen" : "European Middle Ages",
        interpretation: language === 'fr' ?
          "Ce rêve aurait été considéré comme une vision prophétique ou un avertissement divin, peut-être lié à votre destinée personnelle." :
          "This dream would have been considered a prophetic vision or divine warning, perhaps related to your personal destiny."
      },
      {
        era: language === 'fr' ? "Culture Amérindienne" : "Native American culture",
        interpretation: language === 'fr' ?
          "Les chamans auraient interprété ce rêve comme une rencontre avec un esprit animal ou un guide spirituel cherchant à transmettre une sagesse ancestrale." :
          "Shamans would have interpreted this dream as an encounter with an animal spirit or spiritual guide seeking to transmit ancestral wisdom."
      }
    ],
    creature: {
      name: creatureName,
      description: creatureDesc,
      characteristics: language === 'fr' ?
        "Capable de transformer les symboles oniriques en sagesse pratique, cette entité sert de pont entre le conscient et l'inconscient." :
        "Capable of transforming oneiric symbols into practical wisdom, this entity serves as a bridge between the conscious and unconscious."
    },
    ritual: {
      title: ritualName,
      objective: language === 'fr' ?
        "Renforcer les messages de ce rêve et faciliter votre développement personnel" :
        "Strengthen the messages of this dream and facilitate your personal development",
      materials: language === 'fr' ?
        "Un carnet de rêves, une bougie violette, un objet personnel lié au thème du rêve" :
        "A dream journal, a violet candle, a personal object related to the dream theme",
      steps: language === 'fr' ?
        "1. Avant de dormir, écrivez votre intention de comprendre ce rêve plus profondément\n2. Méditez 5 minutes sur les symboles principaux du rêve\n3. Placez l'objet choisi sous votre oreiller\n4. Au réveil, notez immédiatement toute nouvelle perspective" :
        "1. Before sleeping, write your intention to understand this dream more deeply\n2. Meditate for 5 minutes on the main symbols of the dream\n3. Place the chosen object under your pillow\n4. Upon waking, immediately note any new perspective",
      justification: language === 'fr' ?
        "Ce rituel combine des éléments de psychologie jungienne (focus sur les symboles), de pleine conscience (méditation), et d'amorçage cognitif (intention avant le sommeil)." :
        "This ritual combines elements of Jungian psychology (focus on symbols), mindfulness (meditation), and cognitive priming (intention before sleep)."
    },
    reasoning: language === 'fr' ?
      "Cette interprétation est basée sur des archétypes universels présents dans de nombreuses cultures et des théories psychologiques qui reconnaissent les rêves comme des expressions symboliques de notre inconscient." :
      "This interpretation is based on universal archetypes present in many cultures and psychological theories that recognize dreams as symbolic expressions of our unconscious."
  };
}
