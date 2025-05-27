
import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  direction: number;
  initialX: number;
  initialY: number;
}

const StarryBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    
    // Create stars with movement properties
    const starCount = Math.floor((width * height) / 5000);
    const stars: Star[] = [];
    
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      stars.push({
        x,
        y,
        initialX: x,
        initialY: y,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
        direction: Math.random() * Math.PI * 2,
      });
    }
    
    starsRef.current = stars;
    
    // Generate initial stars
    renderStars();
    
    // Start animation
    animateStars();
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);
  
  const animateStars = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    
    starsRef.current.forEach((star, index) => {
      // Move star based on direction and speed
      star.x += Math.cos(star.direction) * star.speed;
      star.y += Math.sin(star.direction) * star.speed;
      
      // Wrap around screen edges
      if (star.x > width + 10) star.x = -10;
      if (star.x < -10) star.x = width + 10;
      if (star.y > height + 10) star.y = -10;
      if (star.y < -10) star.y = height + 10;
      
      // Update star element position
      const starElement = container.children[index] as HTMLElement;
      if (starElement) {
        starElement.style.left = `${star.x}px`;
        starElement.style.top = `${star.y}px`;
      }
    });
    
    animationRef.current = requestAnimationFrame(animateStars);
  };
  
  const renderStars = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Clear existing stars
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Create star elements
    starsRef.current.forEach((star) => {
      const starElement = document.createElement('div');
      starElement.className = 'star';
      starElement.style.width = `${star.size}px`;
      starElement.style.height = `${star.size}px`;
      starElement.style.left = `${star.x}px`;
      starElement.style.top = `${star.y}px`;
      starElement.style.opacity = star.opacity.toString();
      
      // Add twinkling animation
      const animationDuration = 3 + Math.random() * 7;
      starElement.style.animation = `pulse-soft ${animationDuration}s ease-in-out infinite`;
      
      container.appendChild(starElement);
    });
  };
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default StarryBackground;
