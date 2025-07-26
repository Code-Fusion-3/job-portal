import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Users, Play, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';
import ImageSlideshow from '../ui/ImageSlideshow';

const Hero = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="home" className="w-full h-screen">
      <ImageSlideshow>
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Main Heading */}
            <motion.h1
              variants={titleVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              {t('hero.title')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={titleVariants}
              className="text-xl md:text-2xl text-white text-opacity-90 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={buttonVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.08, boxShadow: '0 0 16px #dc2626' }}
                whileTap={{ scale: 0.97 }}
                className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="group bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700 text-shadow"
                >
                  {t('hero.cta.register')}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </motion.div>
              <Button
                variant="outline"
                size="lg"
                className="group border-white text-white hover:bg-white hover:text-gray-900 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              >
                {t('hero.cta.browse')}
                <Users className="ml-2 group-hover:scale-110 transition-transform duration-200" />
              </Button>
            </motion.div>

            {/* Interactive Element - 360° Tour */}
            <motion.div
              variants={buttonVariants}
              className="flex justify-center pt-8"
            >
              <motion.a
                href="#tour"
                className="inline-flex items-center text-white hover:text-red-400 transition-colors duration-200 group drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-3 group-hover:bg-red-700 transition-colors duration-200">
                  <Play className="w-5 h-5 ml-1" />
                </div>
                <span className="text-lg font-medium">360° PLATFORM TOUR</span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
        {/* Scroll Down Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-10 h-10 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] animate-bounce" />
        </motion.div>
      </ImageSlideshow>
    </section>
  );
};

export default Hero; 