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
  const { t, i18n } = useTranslation(); 
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  // Fetch job categories for quick access
  const { categories, loading: categoriesLoading } = usePublicCategories();
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

    // Hero content animations - title is now always visible
    // Disabled title animation to ensure visibility on all devices
    tl.fromTo('.hero-subtitle',
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
    <section id="home" className="w-full min-h-screen relative overflow-hidden hero-section">
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
        <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 min-h-screen flex items-center justify-center text-center py-4">
          <div className="space-y-3 sm:space-y-4 md:space-y-6 w-full max-w-5xl">
            {/* Main Heading */}
            <h1 
              className="hero-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              style={{ opacity: 1, visibility: 'visible', transform: 'none' }}
            >
              {t('hero.title')}
            </h1>

            {/* Subtitle */}
            <p 
              className="hero-subtitle text-sm sm:text-base md:text-lg lg:text-xl text-white text-opacity-90 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] px-2"
              style={{ opacity: 1, visibility: 'visible', transform: 'none' }}
            >
              {t('hero.subtitle')}
            </p>

            {/* Placeholder for GSAP .hero-categories animation */}
            <div className="hero-categories" style={{ minHeight: 10 }}></div>

            {/* CTA Buttons */}
            <div className="hero-buttons flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center opacity-100 visible">
              {/* Food Image - Left of Login Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block relative group"
              >
                <Link to="/employer-request" className="block">
                  <img
                    src="/food.png"
                    alt="Food Services"
                    className="w-12 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 object-contain rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm p-1 sm:p-2"
                  />
                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Food Services
                  </div>
                </Link>
              </motion.div>

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

              {/* Car Image - Right of Job Seekers Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block relative group"
              >
                <Link to="/employer-request" className="block">
                  <img
                    src="/car.png"
                    alt="Transportation Services"
                    className="w-12 h-8 sm:w-12 sm:h-12 md:w-24 md:h-24 object-contain rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm p-1 sm:p-2"
                  />
                  {/* Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    Transportation Services
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Quick Categories Access */}
            {!categoriesLoading && categories && categories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="hero-categories mt-2 sm:mt-3 max-w-4xl mx-auto opacity-100 visible"
              >
                <div className="text-center mb-3 sm:mb-4">
                  <p className="text-white/80 text-sm md:text-base font-medium">
                    {t('hero.categories.title', 'Popular Categories')}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3">
                  {categories.slice(0, 17).reverse().map((category, index) => {
                    // Determine the correct name field based on current language
                    const lang = i18n.language;
                    const catName = lang === 'rw' ? category.name_rw : category.name_en;
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                        className={`${index >= 8 ? 'hidden lg:block' : ''}`}
                      >
                        <Link
                          to={`/job-seekers?category=${encodeURIComponent(catName?.toLowerCase?.() || '')}`}
                          className="group inline-flex items-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-xs md:text-sm font-medium hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
                        >
                          <Briefcase className="h-3 w-3 mr-1.5 sm:mr-2 opacity-80 group-hover:opacity-100" />
                          <span>{catName}</span>
                          <ChevronRight className="h-3 w-3 ml-1 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />

                        </Link>
                      </motion.div>
                    );
                  })}
                  {categories.length > 8 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 2 }}
                      className="w-full sm:w-auto"
                    >
                      <Link
                        to="/job-seekers"
                        className="inline-flex items-center px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-red-600/80 backdrop-blur-sm border border-red-500/50 rounded-full text-white text-xs md:text-sm font-medium hover:bg-red-600 hover:border-red-500 transition-all duration-300 hover:scale-105"
                      >
                        <span>View All ({categories.length})</span>
                        <ChevronRight className="h-3 w-3 ml-1 flex-shrink-0" />
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