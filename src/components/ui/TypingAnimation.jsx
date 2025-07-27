import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TypingAnimation = ({ 
  text, 
  className = "", 
  speed = 1, 
  fallDelay = 100,
  fallDistance = 300, // Increased to fall from navbar
  onComplete = () => {} 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  // Reset animation when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  return (
    <div className={className}>
      {displayedText.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ 
            y: -fallDistance, 
            opacity: 0,
            rotateX: -90,
            scale: 0.5,
            filter: 'blur(2px)'
          }}
          animate={{ 
            y: 0, 
            opacity: 1,
            rotateX: 0,
            scale: 1,
            filter: 'blur(0px)'
          }}
          transition={{
            duration: 1.2,
            delay: index * fallDelay / 1000,
            ease: "easeOut",
            type: "spring",
            stiffness: 80,
            damping: 15
          }}
          className="inline-block"
          style={{
            transformOrigin: 'center bottom',
            display: 'inline-block',
            whiteSpace: 'pre'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
      
      {/* Blinking cursor */}
      <AnimatePresence>
        {!isComplete && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block ml-1 w-0.5 h-full bg-current"
            style={{ animationDelay: '0.5s' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TypingAnimation; 