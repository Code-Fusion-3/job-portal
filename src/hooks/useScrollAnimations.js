import { useEffect, useRef } from 'react';



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
    }
  }).catch(error => {
    console.error('useScrollAnimations: Error importing GSAP modules:', error);
  });
} catch (error) {
  console.error('useScrollAnimations: Error in dynamic import setup:', error);
}

export const useScrollAnimations = () => {
  const containerRef = useRef(null);

  // Stagger animation for job seeker cards
  const initStaggerAnimation = () => {
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping stagger animation');
      return;
    }

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
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping text reveal');
      return;
    }

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

  // Floating stats animation
  const initFloatingStats = () => {
    if (!gsap) {
      console.warn('useScrollAnimations: GSAP not available, skipping floating stats');
      return;
    }

    try {
      const statElements = document.querySelectorAll('.floating-stat');
      
      if (statElements.length === 0) {
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
            start: 'top 90%',
            end: 'bottom 10%',
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
      console.warn('useScrollAnimations: GSAP not available, skipping parallax');
      return;
    }

    try {
      const heroSection = document.querySelector('.hero-section');
      
      if (!heroSection) {
        return;
      }

      gsap.to(heroSection, {
        yPercent: -50,
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
      const counterElements = document.querySelectorAll('.counter-animation');
      
      if (counterElements.length === 0) {
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
              start: 'top 80%',
              end: 'bottom 20%',
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
      
      if (waveElements.length === 0) {
        return;
      }

      waveElements.forEach(element => {
        gsap.to(element, {
          rotation: 360,
          duration: 20,
          ease: 'none',
          repeat: -1,
          scrollTrigger: {
            trigger: element,
            start: 'top 90%',
            end: 'bottom 10%',
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
      
      if (featureCards.length === 0) {
        return;
      }

      gsap.fromTo(featureCards,
        {
          opacity: 0,
          y: 50,
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
            trigger: '.features-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    } catch (error) {
      console.error('useScrollAnimations: Error in features animation:', error);
    }
  };

  useEffect(() => {
    const checkGSAPAndInit = () => {
      if (gsap && ScrollTrigger) {
        // Initialize all animations
        initStaggerAnimation();
        initTextReveal();
        initFloatingStats();
        initParallaxEffect();
        initCounterAnimation();
        initWaveAnimation();
        initFeaturesAnimation();
      } else {
        // Retry after a short delay
        setTimeout(checkGSAPAndInit, 100);
      }
    };

    // Start checking for GSAP availability
    checkGSAPAndInit();

    // Cleanup function
    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, []);

  return containerRef;
}; 