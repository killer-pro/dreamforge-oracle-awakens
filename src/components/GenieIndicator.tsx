import React, { useState, useEffect } from 'react';

interface GenieIndicatorProps {
  isVisible?: boolean;
  isTyping?: boolean;
  characterCount?: number;
}

const GenieIndicator: React.FC<GenieIndicatorProps> = ({
                                                         isVisible = true,
                                                         isTyping = false,
                                                         characterCount = 0
                                                       }) => {
  const [showBubble, setShowBubble] = useState(false);
  const [peekState, setPeekState] = useState<'hidden' | 'emerging' | 'visible' | 'hiding'>('hidden');
  const [bubbleText, setBubbleText] = useState('Interesting...');

  useEffect(() => {
    // Détermine le texte de la bulle selon le nombre de caractères
    if (characterCount > 100) {
      setBubbleText('Very interesting...');
    } else if (characterCount >= 30) {
      setBubbleText('Interesting...');
    }
  }, [characterCount]);

  useEffect(() => {
    if (isVisible && isTyping && characterCount >= 30) {
      // Le génie sort quand l'utilisateur tape 30+ caractères
      if (peekState === 'hidden') {
        setPeekState('emerging');
        setTimeout(() => {
          setPeekState('visible');
          setShowBubble(true);
        }, 600); // Temps pour l'animation d'émergence
      } else if (peekState === 'visible') {
        setShowBubble(true);
      }
    } else if (!isTyping || characterCount < 30) {
      // Le génie se cache quand l'utilisateur arrête de taper ou < 30 caractères
      if (peekState === 'visible' || peekState === 'emerging') {
        setShowBubble(false);
        setPeekState('hiding');
        setTimeout(() => {
          setPeekState('hidden');
        }, 400); // Temps pour l'animation de disparition
      }
    }
  }, [isVisible, isTyping, characterCount, peekState]);

  if (!isVisible) return null;

  const getContainerClass = () => {
    switch (peekState) {
      case 'emerging':
        return 'genie-mole-container emerge';
      case 'visible':
        return 'genie-mole-container visible';
      case 'hiding':
        return 'genie-mole-container hide';
      default:
        return 'genie-mole-container hidden';
    }
  };

  return (
      <>
        <style>{`
        /* Genie Mole Component - Caché derrière le textarea par défaut */
        .genie-mole-container {
          position: absolute;
          top: -40px; /* Complètement caché derrière le textarea */
          left: 20px;
          z-index: 5; /* Derrière le textarea */
          pointer-events: none;
          transform: translateY(0);
          opacity: 0;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .genie-mole-container.hidden {
          transform: translateY(0);
          opacity: 0;
        }

        .genie-mole-container.emerge {
          transform: translateY(-45px);
          opacity: 1;
          animation: mole-emerge 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .genie-mole-container.visible {
          transform: translateY(-45px);
          opacity: 1;
        }

        .genie-mole-container.hide {
          transform: translateY(10px);
          opacity: 0;
          animation: mole-hide 0.4s ease-in;
        }
        /* Thought bubble - Forme de nuage */
        .thought-bubble {
          position: absolute;
          top: -55px;
          left: 45px;
          background: rgba(255, 255, 255, 0.95);
          padding: 10px 16px;
          border-radius: 25px;
          font-size: 13px;
          font-weight: 600;
          color: #8B5CF6;
          white-space: nowrap;
          box-shadow: 
            0 6px 25px rgba(0, 0, 0, 0.15),
            0 2px 10px rgba(139, 92, 246, 0.2);
          opacity: 0;
          transform: scale(0.8) translateY(8px);
          animation: bubble-appear 0.6s ease-out 0.2s forwards, bubble-float 6s ease-in-out infinite 0.8s;
          position: relative;
        }

        /* Forme de nuage pour la bulle */
        .thought-bubble::before {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 25px;
          width: 15px;
          height: 15px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          box-shadow: 
            -5px 0 0 -2px rgba(255, 255, 255, 0.95),
            5px 0 0 -2px rgba(255, 255, 255, 0.95);
        }

        .thought-bubble::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 20px;
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          box-shadow: 
            8px 2px 0 -2px rgba(255, 255, 255, 0.85);
        }

        /* Sparkles around genie */
        .genie-sparkles {
          position: absolute;
          top: -100px;
          left: -10px;
          right: -10px;
          pointer-events: none;
        }

        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #FBBF24;
          border-radius: 50%;
          animation: sparkle-twinkle 2.5s ease-in-out infinite;
        }

        .sparkle:nth-child(1) {
          top: 5px;
          right: 10px;
          animation-delay: 0s;
        }

        .sparkle:nth-child(2) {
          top: 20px;
          right: -5px;
          animation-delay: 0.8s;
        }

        .sparkle:nth-child(3) {
          bottom: 15px;
          left: -5px;
          animation-delay: 1.6s;
        }

        .sparkle:nth-child(4) {
          top: 10px;
          left: 5px;
          animation-delay: 0.4s;
        }

        /* Animations */
        @keyframes mole-emerge {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          70% {
            transform: translateY(-50px);
            opacity: 1;
          }
          100% {
            transform: translateY(-45px);
            opacity: 1;
          }
        }

        @keyframes mole-hide {
          0% {
            transform: translateY(-45px);
            opacity: 1;
          }
          100% {
            transform: translateY(10px);
            opacity: 0;
          }
        }

        @keyframes genie-float {
          0%, 100% {
            transform: translateY(0) rotate(-0.5deg);
          }
          50% {
            transform: translateY(-4px) rotate(0.5deg);
          }
        }

        @keyframes bubble-appear {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes bubble-float {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1) translateY(-3px);
          }
        }

        @keyframes sparkle-twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }         
          .thought-bubble {
            font-size: 11px;
            padding: 8px 12px;
            top: -150px;
            left: 35px;
          }
        }

        /* Ensure textarea has proper z-index */
        .dream-textarea-container {
          position: relative;
          z-index: 10;
        }
      `}</style>

        <div className={getContainerClass()}>
          {/* Sparkles */}
          <div className="genie-sparkles">
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
          </div>

          {/* Corps du génie avec bras - style original */}
          <div className="relative">
            <div className="w-16 h-20 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-t-full relative animate-float">
              {/* Visage */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gradient-to-b from-purple-300 to-purple-400 rounded-full">
                {/* Yeux */}
                <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
                {/* Bouche */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-white rounded-full"></div>
              </div>

              {/* Bras */}
              <div className="absolute top-6 -left-2 w-4 h-2 bg-purple-400 rounded-full rotate-45"></div>
              <div className="absolute top-6 -right-2 w-4 h-2 bg-purple-400 rounded-full -rotate-45"></div>
            </div>

            {/* Particules magiques */}
            <div className="absolute -top-2 -left-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 right-1 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute top-4 -right-3 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          </div>

          {/* Thought bubble */}
          {showBubble && (
              <div className="thought-bubble">
                {bubbleText}
              </div>
          )}
        </div>
      </>
  );
};

export default GenieIndicator;