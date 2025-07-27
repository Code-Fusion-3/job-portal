import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimations = () => {
  const containerRef = useRef(null);

  // Enhanced stagger animation for job seeker cards
  const initStaggerAnimation = () => {
    const cards = document.querySelectorAll('.job-seeker-card');
    if (cards.length === 0) return;

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
  };

  // Enhanced text reveal animation
  const initTextReveal = () => {
    const textElements = document.querySelectorAll('.text-reveal');
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
  };

  // Enhanced floating animation for stats
  const initFloatingStats = () => {
    const stats = document.querySelectorAll('.floating-stat');
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
  };

  // Parallax effect for hero section
  const initParallaxEffect = () => {
    const heroSection = document.querySelector('#home');
    if (!heroSection) return;

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
  };

  // Counter animation for stats
  const initCounterAnimation = () => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      if (!target) return;

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(counter, {
            innerHTML: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerHTML: 1 },
            onUpdate: function() {
              counter.innerHTML = Math.ceil(this.targets()[0].innerHTML);
            }
          });
        }
      });
    });
  };

  // Wave animation for contact form
  const initWaveAnimation = () => {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const wave = document.createElement('div');
    wave.className = 'wave-animation';
    wave.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, transparent 30%, rgba(220, 38, 38, 0.1) 50%, transparent 70%);
      transform: translateX(-100%);
      pointer-events: none;
      z-index: 1;
    `;
    form.style.position = 'relative';
    form.appendChild(wave);

    gsap.to(wave, {
      x: '200%',
      duration: 2.5,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: form,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });
  };

  // Features section animation
  const initFeaturesAnimation = () => {
    const features = document.querySelectorAll('.feature-card');
    if (features.length === 0) return;

    gsap.fromTo(features,
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
  };

  // Initialize all animations
  useEffect(() => {
    const initAnimations = () => {
      try {
        // Wait a bit longer for DOM to be fully ready
        setTimeout(() => {
          initStaggerAnimation();
          initTextReveal();
          initFloatingStats();
          initParallaxEffect();
          initCounterAnimation();
          initWaveAnimation();
          initFeaturesAnimation();
        }, 1000);
      } catch (error) {
        console.error('Animation initialization error:', error);
      }
    };

    // Wait for DOM to be ready
    const timer = setTimeout(initAnimations, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return { containerRef };
}; 