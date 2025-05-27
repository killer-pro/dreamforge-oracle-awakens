import React, { useState, useEffect } from 'react';

interface GenieIndicatorProps {
  isVisible?: boolean;
  isTyping?: boolean;
}

const GenieIndicator: React.FC<GenieIndicatorProps> = ({ 
  isVisible = true, 
  isTyping = false 
}) => {
  const [showBubble, setShowBubble] = useState(false);
  const [peekState, setPeekState] = useState<'hidden' | 'peeking' | 'visible'>('hidden');

  useEffect(() => {
    if (isVisible && isTyping) {
      // Genie peeks out when user starts typing
      setPeekState('peeking');
      setTimeout(() => {
        setPeekState('visible');
        setShowBubble(true);
      }, 300);
    } else if (!isTyping) {
      // Genie hides when user stops typing
      setShowBubble(false);
      setPeekState('hidden');
    }
  }, [isVisible, isTyping]);

  if (!isVisible) return null;

  const getContainerClass = () => {
    switch (peekState) {
      case 'peeking':
        return 'genie-mole-container peek-out';
      case 'visible':
        return 'genie-mole-container peek-out';
      default:
        return 'genie-mole-container hide';
    }
  };

  return (
      <>
        <style>{`
        /* Genie Mole Component - Appears like a mole from behind textarea */
        .genie-mole-container {
          position: absolute;
          top: -15px; /* Partially hidden behind textarea */
          left: 20px;
          z-index: 5; /* Behind textarea but visible */
          pointer-events: none;
          transform: translateY(0);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .genie-mole-container.peek-out {
          transform: translateY(-25px);
          animation: mole-peek 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .genie-mole-container.hide {
          transform: translateY(10px);
          opacity: 0.7;
        }

        /* Genie character - no tail, compact design */
        .genie-mole {
          width: 60px;
          height: 45px;
          background: linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%);
          border-radius: 50% 50% 45% 45%;
          position: relative;
          box-shadow: 
            0 8px 25px rgba(139, 92, 246, 0.4),
            inset 0 2px 10px rgba(255, 255, 255, 0.2);
          animation: genie-float 3s ease-in-out infinite;
        }

        /* Genie face elements */
        .genie-mole::before {
          content: '';
          position: absolute;
          top: 15px;
          left: 15px;
          width: 8px;
          height: 8px;
          background: #1F2937;
          border-radius: 50%;
          box-shadow: 15px 0 0 #1F2937;
        }

        .genie-mole::after {
          content: '';
          position: absolute;
          top: 25px;
          left: 25px;
          width: 10px;
          height: 6px;
          background: #EC4899;
          border-radius: 50%;
          opacity: 0.8;
        }

        /* Genie turban */
        .genie-turban {
          position: absolute;
          top: -8px;
          left: 8px;
          width: 44px;
          height: 20px;
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
          border-radius: 50% 50% 20% 20%;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .genie-turban::before {
          content: '';
          position: absolute;
          top: -5px;
          left: 18px;
          width: 8px;
          height: 12px;
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
        }

        /* Thought bubble - Snapchat style */
        .thought-bubble {
          position: absolute;
          top: -50px;
          left: 50px;
          background: rgba(255, 255, 255, 0.95);
          padding: 8px 12px;
          border-radius: 18px;
          font-size: 12px;
          font-weight: 600;
          color: #8B5CF6;
          white-space: nowrap;
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.1),
            0 2px 8px rgba(139, 92, 246, 0.2);
          opacity: 0;
          transform: scale(0.8) translateY(5px);
          animation: bubble-appear 0.5s ease-out 0.3s forwards;
        }

        .thought-bubble::before {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 20px;
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          transform: rotate(45deg);
        }

        .thought-bubble::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 15px;
          width: 8px;
          height: 8px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
        }

        /* Sparkles around genie */
        .genie-sparkles {
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          pointer-events: none;
        }

        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #FBBF24;
          border-radius: 50%;
          animation: sparkle-twinkle 2s ease-in-out infinite;
        }

        .sparkle:nth-child(1) {
          top: 5px;
          right: 10px;
          animation-delay: 0s;
        }

        .sparkle:nth-child(2) {
          top: 20px;
          right: -5px;
          animation-delay: 0.7s;
        }

        .sparkle:nth-child(3) {
          bottom: 15px;
          left: -5px;
          animation-delay: 1.4s;
        }

        .sparkle:nth-child(4) {
          top: 10px;
          left: 5px;
          animation-delay: 0.3s;
        }

        /* Animations */
        @keyframes mole-peek {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
          100% {
            transform: translateY(-25px);
          }
        }

        @keyframes genie-float {
          0%, 100% {
            transform: translateY(0) rotate(-1deg);
          }
          50% {
            transform: translateY(-3px) rotate(1deg);
          }
        }

        @keyframes bubble-appear {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes sparkle-twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .genie-mole-container {
            left: 15px;
            top: -12px;
          }
          
          .genie-mole {
            width: 50px;
            height: 38px;
          }
          
          .genie-turban {
            width: 36px;
            height: 16px;
            left: 7px;
          }
          
          .thought-bubble {
            font-size: 11px;
            padding: 6px 10px;
            top: -30px;
            right: -10px;
          }
        }

        /* Ensure textarea has proper z-index to partially hide genie */
        .dream-textarea-container {
          position: relative;
          z-index: 10;
        }
      `}</style>
        <div
            className="absolute -bottom-2 left-6 w-3 h-3 bg-white/95 rotate-45 border-r border-b border-violet-200/50"></div>

        <div className={getContainerClass()}>
          {/* Sparkles */}
          <div className="genie-sparkles">
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
            <div className="sparkle"></div>
          </div>
        </div>

        {/* Génie */}
        <div className="relative">
          {/* Corps du génie */}
          <div
              className="w-16 h-20 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-t-full relative animate-float">
            {/* Visage */}
            <div
                className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gradient-to-b from-purple-300 to-purple-400 rounded-full">
              {/* Yeux */}
              <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-white rounded-full"></div>
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
              {/* Bouche */}
              <div
                  className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-white rounded-full"></div>
            </div>

            {/* Bras */}
            <div className="absolute top-6 -left-2 w-4 h-2 bg-purple-400 rounded-full rotate-45"></div>
            <div className="absolute top-6 -right-2 w-4 h-2 bg-purple-400 rounded-full -rotate-45"></div>
          </div>
          {/* Particules magiques */}
          <div className="absolute -top-2 -left-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute -top-1 right-1 w-1 h-1 bg-blue-400 rounded-full animate-ping"
               style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-4 -right-3 w-1 h-1 bg-pink-400 rounded-full animate-ping"
               style={{animationDelay: '1s'}}></div>
          {/* Thought bubble */}
          {showBubble && (
              <div className="thought-bubble">
                Interesting...
              </div>
          )}
        </div>
      </>
  );
};

export default GenieIndicator;