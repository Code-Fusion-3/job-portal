import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const BackButton = ({ 
  to = '/job-seekers', 
  text = 'Back to Job Seekers',
  className = '',
  ...props 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`mb-6 ${className}`}
      {...props}
    >
      <Button
        variant="ghost"
        onClick={handleClick}
        className="text-red-400 hover:text-gray-500 bg-white hover:bg-gray-50 border border-gray-200"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {text}
      </Button>
    </motion.div>
  );
};

export default BackButton; 