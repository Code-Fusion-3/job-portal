import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import ImageSlideshow from '../ui/ImageSlideshow';
import { usePublicCategories } from '../../api/hooks/useCategories.js';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const { t } = useTranslation(); 
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  // Fetch job categories for quick access
  const { categories, loading: categoriesLoading } = usePublicCategories();
console.log(categories, categoriesLoading);
  // Three.js setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create floating shapes
    const shapesGeometry = new THREE.IcosahedronGeometry(0.1, 0);
    const shapesMaterial = new THREE.MeshBasicMaterial({
      color: 0xdc2626,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });

    const shapes = [];
    for (let i = 0; i < 20; i++) {
      const shape = new THREE.Mesh(shapesGeometry, shapesMaterial);
      shape.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      );
      shape.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(shape);
      shapes.push(shape);
    }

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Rotate particles
      particlesMesh.rotation.x += 0.001;
      particlesMesh.rotation.y += 0.002;

      // Animate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.01 + index * 0.001;
        shape.rotation.y += 0.01 + index * 0.001;
        shape.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      renderer.dispose();
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    // Hero content animations
    tl.fromTo('.hero-title',
      {
        opacity: 0,
        y: -100,
        scale: 0.8,
        rotationX: -90
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1.5,
        ease: 'back.out(1.7)'
      }
    )
      .fromTo('.hero-subtitle',
        {
          opacity: 0,
          y: 50,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        },
        '-=0.5'
      )
      .fromTo('.hero-buttons',
        {
          opacity: 0,
          y: 80,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        },
        '-=0.3'
      )
      .fromTo('.hero-categories',
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
          ease: 'power2.out'
        },
        '-=0.2'
      );

    // Parallax effect for Three.js background
    if (canvasRef.current) {
      gsap.to(canvasRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    }

  }, []);

  return (
    <section id="home" className="w-full h-screen relative overflow-hidden hero-section">
      {/* Image Slideshow Background */}
      <ImageSlideshow>
        {/* Three.js Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none" style={{ zIndex: 2 }} />

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center text-center">
          <div className="space-y-8">
            {/* Main Heading */}
            <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-reveal">
              {t('hero.title')}
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle text-xl md:text-2xl text-white text-opacity-90 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] text-reveal">
              {t('hero.subtitle')}
            </p>

            {/* Placeholder for GSAP .hero-categories animation */}
            <div className="hero-categories" style={{ minHeight: 10 }}></div>

            {/* CTA Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/login">
                <Button variant="primary" size="lg">
                  {t('hero.cta.primary')}
                </Button>
              </Link>
              <Link to="/job-seekers">
                <Button as="div" variant="secondary" size="lg">
                  {t('hero.cta.secondary')}
                </Button>
              </Link>
            </div>

            {/* Quick Categories Access */}
            {!categoriesLoading && categories && categories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="hero-categories mt-8 max-w-4xl mx-auto"
              >
                <div className="text-center mb-4">
                  <p className="text-white/80 text-sm md:text-base font-medium">
                    {t('hero.categories.title', 'Popular Categories')}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {categories.slice(0, 6).map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                    >
                      <Link
                        to={`/job-seekers?category=${encodeURIComponent(category.name_en.toLowerCase())}`}
                        className="group inline-flex items-center px-3 md:px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs md:text-sm font-medium hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                      >
                        <Briefcase className="h-3 w-3 md:h-4 md:w-4 mr-2 opacity-80 group-hover:opacity-100" />
                        <span>{category.name_en}</span>
                        <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    </motion.div>
                  ))}
                  {categories.length > 6 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 2 }}
                    >
                      <Link
                        to="/job-seekers"
                        className="inline-flex items-center px-3 md:px-4 py-2 bg-red-600/80 backdrop-blur-sm border border-red-500/50 rounded-full text-white text-xs md:text-sm font-medium hover:bg-red-600 hover:border-red-500 transition-all duration-300 hover:scale-105"
                      >
                        <span>View All ({categories.length})</span>
                        <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-6 h-10 border-2 border-white border-opacity-50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </ImageSlideshow>
    </section>
  );
};

export default Hero; 