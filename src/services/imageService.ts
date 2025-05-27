
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';

export interface GenerateImageParams {
  dreamDescription: string;
  style?: 'surreal' | 'mystical' | 'abstract' | 'realistic';
}

export async function generateDreamImage(params: GenerateImageParams): Promise<string | null> {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not found, skipping image generation');
    return null;
  }

  try {
    const prompt = `Create a detailed visual description for an artistic representation of this dream: "${params.dreamDescription}". 
    Style: ${params.style || 'surreal'}. 
    Focus on symbolic elements, colors, atmosphere, and mystical aspects. 
    Make it vivid and dreamlike, suitable for digital art generation.
    Respond with only the visual description, no additional text.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 200,
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate image description');
    }

    const data = await response.json();
    const imageDescription = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (imageDescription) {
      // Pour le moment, nous retournons une image placeholder basée sur la description
      // Dans une vraie implémentation, vous pourriez utiliser DALL-E, Midjourney, etc.
      return generatePlaceholderImage(imageDescription);
    }

    return null;
  } catch (error) {
    console.error('Error generating dream image:', error);
    return null;
  }
}

function generatePlaceholderImage(description: string): string {
  // Génère une image placeholder avec un gradient basé sur le contenu du rêve
  const colors = extractColorsFromDescription(description);
  return `data:image/svg+xml,${encodeURIComponent(createGradientSVG(colors))}`;
}

function extractColorsFromDescription(description: string): string[] {
  const colorMap: { [key: string]: string } = {
    'blue': '#3B82F6',
    'purple': '#8B5CF6',
    'violet': '#7C3AED',
    'gold': '#F59E0B',
    'green': '#10B981',
    'red': '#EF4444',
    'pink': '#EC4899',
    'dark': '#1F2937',
    'light': '#F9FAFB',
    'mystical': '#8B5CF6',
    'dreamy': '#A855F7',
    'ethereal': '#C084FC'
  };

  const colors = ['#8B5CF6', '#3B82F6']; // couleurs par défaut
  
  Object.keys(colorMap).forEach(keyword => {
    if (description.toLowerCase().includes(keyword)) {
      colors.push(colorMap[keyword]);
    }
  });

  return colors.slice(0, 3);
}

function createGradientSVG(colors: string[]): string {
  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dreamGrad" cx="50%" cy="50%" r="60%">
          <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:0.8" />
          <stop offset="50%" style="stop-color:${colors[1] || colors[0]};stop-opacity:0.6" />
          <stop offset="100%" style="stop-color:${colors[2] || colors[1] || colors[0]};stop-opacity:0.4" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#dreamGrad)"/>
      <circle cx="200" cy="150" r="80" fill="white" opacity="0.2" filter="url(#blur)"/>
      <circle cx="150" cy="100" r="40" fill="white" opacity="0.3"/>
      <circle cx="250" cy="200" r="60" fill="white" opacity="0.1" filter="url(#blur)"/>
      <text x="200" y="280" text-anchor="middle" fill="white" font-family="serif" font-size="16" opacity="0.8">Dream Vision</text>
    </svg>
  `;
}
