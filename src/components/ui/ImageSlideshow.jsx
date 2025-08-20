import { useState, useEffect } from 'react';

// Import images from assets with correct file names
import image1 from '../../assets/img1.jpg';
import image2 from '../../assets/img2.jpg';
import image3 from '../../assets/img3.jpg';
import image4 from '../../assets/img4.jpg';
import image5 from '../../assets/img5.jpg';

const ImageSlideshow = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [image1, image2, image3, image4, image5];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        <picture>
          <source srcSet={`./optimized/img${currentIndex+1}-800w.webp 800w, ./optimized/img${currentIndex+1}-1200w.webp 1200w, ./optimized/img${currentIndex+1}-1600w.webp 1600w`} type="image/webp" />
          <source srcSet={`./optimized/img${currentIndex+1}-800w.jpg 800w, ./optimized/img${currentIndex+1}-1200w.jpg 1200w, ./optimized/img${currentIndex+1}-1600w.jpg 1600w`} type="image/jpeg" />
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover object-center transition-opacity duration-1000"
            style={{ minWidth: '100%', minHeight: '100%' }}
            loading="lazy"
          />
        </picture>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70 pointer-events-none" />
      </div>



      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default ImageSlideshow;