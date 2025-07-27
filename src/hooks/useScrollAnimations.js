import { useEffect, useRef } from 'react';

console.log('useScrollAnimations: Starting to import GSAP');

let gsap, ScrollTrigger;

try {
  // Use dynamic imports for better compatibility with Vite
  import('gsap').then(gsapModule => {
    gsap = gsapModule.gsap;
    return import('gsap/ScrollTrigger');
  }).then(scrollTriggerModule => {
    ScrollTrigger = scrollTriggerModule.ScrollTrigger;
    
    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      console.log('useScrollAnimations: GSAP and ScrollTrigger registered successfully');
    }
  }).catch(error => {
    console.error('useScrollAnimations: Error importing GSAP modules:', error);
  });
} catch (error) {
  console.error('useScrollAnimations: Error in dynamic import setup:', error);
}

export const useScrollAnimations = () => {
  const containerRef = useRef(null);

  console.log('useScrollAnimations: Hook initialized');

  // Enhanced stagger animation for job seeker cards
  const initStaggerAnimation = () => {
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping stagger animation');
      return;
    }

    try {
      const cards = document.querySelectorAll('.job-seeker-card');
      if (cards.length === 0) {
        console.log('useScrollAnimations: No job seeker cards found for stagger animation');
        return;
      }

      console.log('useScrollAnimations: Initializing stagger animation for', cards.length, 'cards');

      gsap.fromTo(cards, 
        {
          opacity: 0,
          y: 80,
          scale: 0.8,
          rotationY: 15,
          transformOrigin: 'center bottom'
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
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

  // Enhanced text reveal animation
  const initTextReveal = () => {
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping text reveal');
      return;
    }

    try {
      const textElements = document.querySelectorAll('.text-reveal');
      console.log('useScrollAnimations: Initializing text reveal for', textElements.length, 'elements');

      textElements.forEach(element => {
        gsap.fromTo(element,
          {
            opacity: 0,
            y: 50,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: element,
              start: 'top 85%',
              end: 'bottom 15%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    } catch (error) {
      console.error('useScrollAnimations: Error in text reveal:', error);
    }
  };

  // Enhanced floating animation for stats
  const initFloatingStats = () => {
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping floating stats');
      return;
    }

    try {
      const stats = document.querySelectorAll('.floating-stat');
      console.log('useScrollAnimations: Initializing floating stats for', stats.length, 'elements');

      stats.forEach((stat, index) => {
        gsap.to(stat, {
          y: -15,
          duration: 2.5,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: stat,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    } catch (error) {
      console.error('useScrollAnimations: Error in floating stats:', error);
    }
  };

  // Parallax effect for hero section
  const initParallaxEffect = () => {
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping parallax effect');
      return;
    }

    try {
      const heroSection = document.querySelector('#home');
      if (!heroSection) {
        console.log('useScrollAnimations: Hero section not found for parallax effect');
        return;
      }

      console.log('useScrollAnimations: Initializing parallax effect');

      gsap.to('.parallax-bg', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    } catch (error) {
      console.error('useScrollAnimations: Error in parallax effect:', error);
    }
  };

  // Counter animation for stats
  const initCounterAnimation = () => {
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping counter animation');
      return;
    }

    try {
      const counters = document.querySelectorAll('.counter');
      console.log('useScrollAnimations: Initializing counter animation for', counters.length, 'elements');

      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2;
        
        gsap.to(counter, {
          innerHTML: target,
          duration: duration,
          ease: 'power2.out',
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: counter,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    } catch (error) {
      console.error('useScrollAnimations: Error in counter animation:', error);
    }
  };

  // Wave animation for features
  const initWaveAnimation = () => {
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping wave animation');
      return;
    }

    try {
      const waveElements = document.querySelectorAll('.wave-animation');
      console.log('useScrollAnimations: Initializing wave animation for', waveElements.length, 'elements');

      waveElements.forEach((element, index) => {
        gsap.to(element, {
          y: -20,
          duration: 2,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1,
          delay: index * 0.3,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    } catch (error) {
      console.error('useScrollAnimations: Error in wave animation:', error);
    }
  };

  // Features animation
  const initFeaturesAnimation = () => {
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping features animation');
      return;
    }

    try {
      const featureCards = document.querySelectorAll('.feature-card');
      console.log('useScrollAnimations: Initializing features animation for', featureCards.length, 'cards');

      gsap.fromTo(featureCards,
        {
          opacity: 0,
          y: 60,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.feature-card',
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    } catch (error) {
      console.error('useScrollAnimations: Error in features animation:', error);
    }
  };

  useEffect(() => {
    console.log('useScrollAnimations: useEffect triggered');

    // Wait for GSAP to be available
    const checkGSAPAndInit = () => {
      if (!gsap) {
        console.log('useScrollAnimations: GSAP not ready yet, retrying in 100ms');
        setTimeout(checkGSAPAndInit, 100);
        return;
      }

      console.log('useScrollAnimations: GSAP ready, initializing animations');
      
      try {
        // Initialize all animations
        initStaggerAnimation();
        initTextReveal();
        initFloatingStats();
        initParallaxEffect();
        initCounterAnimation();
        initWaveAnimation();
        initFeaturesAnimation();
        
        console.log('useScrollAnimations: All animations initialized successfully');
      } catch (error) {
        console.error('useScrollAnimations: Error initializing animations:', error);
      }
    };

    // Start checking for GSAP availability
    checkGSAPAndInit();

    // Cleanup function
    return () => {
      console.log('useScrollAnimations: Cleaning up animations');
      try {
        if (ScrollTrigger) {
          ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
      } catch (error) {
        console.error('useScrollAnimations: Error during cleanup:', error);
      }
    };
  }, []);

  return { containerRef };
}; 