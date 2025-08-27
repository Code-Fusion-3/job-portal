import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
      gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimations = () => {
  const containerRef = useRef(null);
  const [animationsInitialized, setAnimationsInitialized] = useState(false);

  // Stagger animation for job seeker cards
  const initStaggerAnimation = () => {
    try {
      const jobSeekerCards = document.querySelectorAll('.job-seeker-card');
      
      if (jobSeekerCards.length === 0) {
        return;
      }

      gsap.fromTo(jobSeekerCards,
        {
          opacity: 0,
          y: 50,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.job-seeker-card',
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    } catch (error) {
      console.error('useScrollAnimations: Error in stagger animation:', error);
    }
  };

  // Text reveal animation
  const initTextReveal = () => {
    try {
      const textElements = document.querySelectorAll('.text-reveal');
      
      if (textElements.length === 0) {
        return;
      }

      textElements.forEach(element => {
        gsap.fromTo(element,
          {
            opacity: 0,
            y: 30,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    } catch (error) {
      console.error('useScrollAnimations: Error in text reveal:', error);
    }
  };

  // Initialize animations when component mounts
  useEffect(() => {
    if (animationsInitialized) return;

    // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
      try {
        initStaggerAnimation();
        initTextReveal();
        setAnimationsInitialized(true);
      } catch (error) {
        console.error('useScrollAnimations: Error initializing animations:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [animationsInitialized]);

  return { containerRef };
}; 