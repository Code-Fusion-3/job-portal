import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Users, Play } from 'lucide-react';
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
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            >
              {t('hero.title')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-white text-opacity-90 max-w-4xl mx-auto leading-relaxed"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                variant="primary"
                size="lg"
                className="group bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
              >
                {t('hero.cta.register')}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group border-white text-white hover:bg-white hover:text-gray-900"
              >
                {t('hero.cta.browse')}
                <Users className="ml-2 group-hover:scale-110 transition-transform duration-200" />
              </Button>
            </motion.div>

            {/* Interactive Element - 360° Tour */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center pt-8"
            >
              <motion.a
                href="#tour"
                className="inline-flex items-center text-white hover:text-red-400 transition-colors duration-200 group"
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
      </ImageSlideshow>
    </section>
  );
};

export default Hero; 