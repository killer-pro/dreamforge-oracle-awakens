
import { DreamAnalysisResult } from "@/components/DreamAnalysis";

const SONAR_API_KEY = import.meta.env.VITE_SONAR_API_KEY;
const SONAR_API_URL = import.meta.env.VITE_SONAR_API_URL;

export async function analyzeDream(dream: string, apiKey: string | null): Promise<DreamAnalysisResult> {
  // Use Sonar API with the provided key
  try {
    const prompt = `
Analyze the following dream and respond strictly in the JSON format specified below:
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

    const response = await fetch(`${SONAR_API_URL}?key=${SONAR_API_KEY}`, {
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
      console.error('Sonar API error:', error);
      throw new Error(error.message || 'Error during dream analysis');
    }

    const data = await response.json();
    let result: DreamAnalysisResult;

    try {
      // Extract content from Sonar response
      const content = data.candidates[0].content.parts[0].text;
      console.log('Sonar response:', content);
      
      // Clean up the response to extract JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      result = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('Failed to parse Sonar response:', e);
      // Fallback to demo mode if parsing fails
      return generateDemoAnalysis(dream);
    }

    return result;
  } catch (error) {
    console.error('Error analyzing dream with Sonar API:', error);
    // Fallback to demo mode if API fails
    return generateDemoAnalysis(dream);
  }
}

function generateDemoAnalysis(dream: string): DreamAnalysisResult {
  // Extract keywords from dream for demo personalization
  const dreamLower = dream.toLowerCase();
  
  // Detection of some common themes
  const hasWater = dreamLower.includes('water') || dreamLower.includes('sea') || dreamLower.includes('ocean') || dreamLower.includes('river');
  const hasFlying = dreamLower.includes('fly') || dreamLower.includes('flying') || dreamLower.includes('sky');
  const hasFalling = dreamLower.includes('fall') || dreamLower.includes('falling');
  const hasAnimal = dreamLower.includes('animal') || dreamLower.includes('cat') || dreamLower.includes('dog') || dreamLower.includes('bird');
  
  // Creation of personalized analysis based on keywords
  let creatureName = "The Oneirosopher";
  let creatureDesc = "A mystical being that traverses dreams and helps understand them";
  let ritualName = "Ritual of Oneiric Clarity";
  
  if (hasWater) {
    creatureName = "The Psychic Undine";
    creatureDesc = "An aquatic entity that navigates the depths of the unconscious";
    ritualName = "Ritual of Reflective Immersion";
  } else if (hasFlying) {
    creatureName = "The Conscious Zephyr";
    creatureDesc = "An aerial being that represents freedom of spirit and elevated aspirations";
    ritualName = "Ritual of Mental Elevation";
  } else if (hasFalling) {
    creatureName = "The Symbolic Graviteer";
    creatureDesc = "A creature that masters emotional gravity and inner descents";
    ritualName = "Ritual of Spiritual Anchoring";
  } else if (hasAnimal) {
    creatureName = "The Psychic Totem";
    creatureDesc = "An animal guide that represents instincts and primitive emotions";
    ritualName = "Ritual of Natural Communion";
  }
  
  return {
    summary: `Your dream "${dream.slice(0, 50)}${dream.length > 50 ? '...' : ''}" reveals fascinating aspects of your unconscious mind.`,
    psychological: "From a Jungian perspective, this dream could represent the integration of contradictory aspects of your personality. The symbols present suggest an ongoing individuation process.",
    spiritual: "In a spiritual reading, this dream symbolizes a connection with universal energies that seek to guide you toward a deeper understanding of your life path.",
    rational: "This dream could be influenced by recent stimuli from your daily life, combined with latent concerns and natural processing of emotions during sleep.",
    historical: [
      {
        era: "Ancient Egypt",
        interpretation: "Egyptian priests would have seen in this dream a message from the gods, particularly related to the concept of Ka and Ba, the different parts of the soul."
      },
      {
        era: "European Middle Ages",
        interpretation: "This dream would have been considered a prophetic vision or divine warning, perhaps related to your personal destiny."
      },
      {
        era: "Native American culture",
        interpretation: "Shamans would have interpreted this dream as an encounter with an animal spirit or spiritual guide seeking to transmit ancestral wisdom."
      }
    ],
    creature: {
      name: creatureName,
      description: creatureDesc,
      characteristics: "Capable of transforming oneiric symbols into practical wisdom, this entity serves as a bridge between the conscious and unconscious."
    },
    ritual: {
      title: ritualName,
      objective: "Strengthen the messages of this dream and facilitate your personal development",
      materials: "A dream journal, a violet candle, a personal object related to the dream theme",
      steps: "1. Before sleeping, write your intention to understand this dream more deeply\n2. Meditate for 5 minutes on the main symbols of the dream\n3. Place the chosen object under your pillow\n4. Upon waking, immediately note any new perspective",
      justification: "This ritual combines elements of Jungian psychology (focus on symbols), mindfulness (meditation), and cognitive priming (intention before sleep)."
    },
    reasoning: "This interpretation is based on universal archetypes present in many cultures and psychological theories that recognize dreams as symbolic expressions of our unconscious. The specific symbols of your dream have been analyzed in their context and in relation to the emotions they evoke."
  };
}
