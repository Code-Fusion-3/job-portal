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

  // Stagger animation for job seeker cards
  const initStaggerAnimation = () => {
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping stagger animation');
      return;
    }

    try {
      const jobSeekerCards = document.querySelectorAll('.job-seeker-card');
      console.log('useScrollAnimations: No job seeker cards found for stagger animation');
      
      if (jobSeekerCards.length === 0) {
        console.log('useScrollAnimations: No job seeker cards found, skipping stagger animation');
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
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping text reveal');
      return;
    }

    try {
      const textElements = document.querySelectorAll('.text-reveal');
      console.log('useScrollAnimations: Initializing text reveal for', textElements.length, 'elements');
      
      if (textElements.length === 0) {
        console.log('useScrollAnimations: No text reveal elements found, skipping text reveal');
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

  // Floating stats animation
  const initFloatingStats = () => {
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping floating stats');
      return;
    }

    try {
      const statElements = document.querySelectorAll('.floating-stat');
      console.log('useScrollAnimations: Initializing floating stats for', statElements.length, 'elements');
      
      if (statElements.length === 0) {
        console.log('useScrollAnimations: No floating stat elements found, skipping floating stats');
        return;
      }

      statElements.forEach(element => {
        gsap.to(element, {
          y: -10,
          duration: 2,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          scrollTrigger: {
            trigger: element,
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
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) {
        console.log('useScrollAnimations: Hero section not found for parallax effect');
        return;
      }

      gsap.to(heroSection, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    } catch (error) {
      console.error('useScrollAnimations: Error in parallax effect:', error);
    }
  };

  // Counter animation
  const initCounterAnimation = () => {
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping counter animation');
      return;
    }

    try {
      const counterElements = document.querySelectorAll('.counter');
      console.log('useScrollAnimations: Initializing counter animation for', counterElements.length, 'elements');
      
      if (counterElements.length === 0) {
        console.log('useScrollAnimations: No counter elements found, skipping counter animation');
        return;
      }

      counterElements.forEach(element => {
        const target = parseInt(element.getAttribute('data-target') || '0');
        const duration = 2;
        
        gsap.fromTo(element, 
          { textContent: 0 },
          {
            textContent: target,
            duration: duration,
            ease: 'power2.out',
            snap: { textContent: 1 },
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
      console.error('useScrollAnimations: Error in counter animation:', error);
    }
  };

  // Wave animation
  const initWaveAnimation = () => {
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping wave animation');
      return;
    }

    try {
      const waveElements = document.querySelectorAll('.wave-animation');
      console.log('useScrollAnimations: Initializing wave animation for', waveElements.length, 'elements');
      
      if (waveElements.length === 0) {
        console.log('useScrollAnimations: No wave elements found, skipping wave animation');
        return;
      }

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
      
      // Only animate if feature cards exist
      if (featureCards.length === 0) {
        console.log('useScrollAnimations: No feature cards found, skipping features animation');
        return;
      }

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