const IMAGE_GENERATION_API_URL = 'https://image.pollinations.ai/prompt/';

export interface GenerateImageParams {
  dreamDescription: string;
  style?: 'surreal' | 'mystical' | 'abstract' | 'realistic';
}

export async function generateDreamImage(params: GenerateImageParams): Promise<string | null> {
  if (!params.dreamDescription) {
    console.warn('No dream description provided for image generation.');
    return generatePlaceholderImage('empty dream');
  }

  try {
    const encodedPrompt = encodeURIComponent(`${params.dreamDescription}, style ${params.style || 'surreal'}`);
    
    const imageUrl = `${IMAGE_GENERATION_API_URL}${encodedPrompt}` +
                     `?width=1024&height=1024&model=flux&nologo=true&private=false&enhance=false&safe=false`;

    console.log('Attempting to generate image from URL:', imageUrl);

    return imageUrl;

  } catch (error) {
    console.error('Error constructing image URL:', error);
    return generatePlaceholderImage(params.dreamDescription);
  }
}

function generateEnhancedPlaceholderImage(description: string, dreamText: string): string {
  const colors = extractColorsFromDescription(description + ' ' + dreamText);
  const elements = extractElementsFromDescription(description);
  
  return `data:image/svg+xml,${encodeURIComponent(createEnhancedGradientSVG(colors, elements))}`;
}

function generatePlaceholderImage(description: string): string {
  const colors = extractColorsFromDescription(description);
  return `data:image/svg+xml,${encodeURIComponent(createGradientSVG(colors))}`;
}

function extractColorsFromDescription(description: string): string[] {
  const colorMap: { [key: string]: string } = {
    'blue': '#3B82F6',
    'purple': '#8B5CF6',
    'violet': '#7C3AED',
    'gold': '#F59E0B',
    'golden': '#F59E0B',
    'green': '#10B981',
    'red': '#EF4444',
    'pink': '#EC4899',
    'dark': '#1F2937',
    'light': '#F9FAFB',
    'mystical': '#8B5CF6',
    'dreamy': '#A855F7',
    'ethereal': '#C084FC',
    'silver': '#94A3B8',
    'orange': '#F97316',
    'yellow': '#EAB308',
    'cyan': '#06B6D4',
    'indigo': '#6366F1',
    'black': '#000000',
    'white': '#FFFFFF'
  };

  const colors = ['#8B5CF6', '#3B82F6'];
  
  Object.keys(colorMap).forEach(keyword => {
    if (description.toLowerCase().includes(keyword)) {
      colors.push(colorMap[keyword]);
    }
  });

  return [...new Set(colors)].slice(0, 4);
}

function extractElementsFromDescription(description: string): string[] {
  const elementKeywords = ['star', 'moon', 'sun', 'cloud', 'mountain', 'water', 'fire', 'crystal', 'eye', 'wing', 'spiral'];
  const foundElements: string[] = [];
  
  elementKeywords.forEach(element => {
    if (description.toLowerCase().includes(element)) {
      foundElements.push(element);
    }
  });
  
  return foundElements.slice(0, 3);
}

function createEnhancedGradientSVG(colors: string[], elements: string[]): string {
  const elementShapes = elements.map((element, index) => {
    const x = 100 + (index * 100);
    const y = 80 + (index * 40);
    
    switch (element) {
      case 'star':
        return `<polygon points="${x},${y-10} ${x+3},${y-3} ${x+10},${y-3} ${x+5},${y+1} ${x+7},${y+8} ${x},${y+4} ${x-7},${y+8} ${x-5},${y+1} ${x-10},${y-3} ${x-3},${y-3}" fill="white" opacity="0.7"/>`;
      case 'moon':
        return `<circle cx="${x}" cy="${y}" r="8" fill="white" opacity="0.6"/>`;
      case 'eye':
        return `<ellipse cx="${x}" cy="${y}" rx="12" ry="8" fill="white" opacity="0.5"/><circle cx="${x}" cy="${y}" r="4" fill="${colors[1] || '#3B82F6'}" opacity="0.8"/>`;
      default:
        return `<circle cx="${x}" cy="${y}" r="6" fill="white" opacity="0.4"/>`;
    }
  }).join('');

  return `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="dreamGrad" cx="50%" cy="40%" r="70%">
          <stop offset="0%" style="stop-color:${colors[0]};stop-opacity:0.9" />
          <stop offset="30%" style="stop-color:${colors[1] || colors[0]};stop-opacity:0.7" />
          <stop offset="70%" style="stop-color:${colors[2] || colors[1] || colors[0]};stop-opacity:0.5" />
          <stop offset="100%" style="stop-color:${colors[3] || colors[2] || colors[1] || colors[0]};stop-opacity:0.3" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#dreamGrad)"/>
      
      <circle cx="120" cy="80" r="25" fill="white" opacity="0.15" filter="url(#blur)"/>
      <circle cx="280" cy="120" r="35" fill="white" opacity="0.1" filter="url(#blur)"/>
      <circle cx="200" cy="200" r="20" fill="white" opacity="0.2"/>
      
      ${elementShapes}
      
      <circle cx="80" cy="50" r="2" fill="white" opacity="0.8" filter="url(#glow)">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="320" cy="60" r="1.5" fill="white" opacity="0.6" filter="url(#glow)">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="150" cy="40" r="2.5" fill="white" opacity="0.7" filter="url(#glow)">
        <animate attributeName="opacity" values="0.2;0.9;0.2" dur="4s" repeatCount="indefinite"/>
      </circle>
      
      <text x="200" y="280" text-anchor="middle" fill="white" font-family="serif" font-size="14" opacity="0.8" filter="url(#glow)">Dream Vision</text>
      
      <path d="M 0,150 Q 100,130 200,150 T 400,150" stroke="white" stroke-width="1" fill="none" opacity="0.3">
        <animate attributeName="d" values="M 0,150 Q 100,130 200,150 T 400,150;M 0,150 Q 100,170 200,150 T 400,150;M 0,150 Q 100,130 200,150 T 400,150" dur="6s" repeatCount="indefinite"/>
      </path>
    </svg>
  `;
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
