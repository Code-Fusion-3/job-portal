import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import Card from './Card';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'increase', 
  icon: Icon, 
  color, 
  bgColor, 
  description,
  index = 0,
  trendPeriod = '7 days',
  showTrend = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          {showTrend && change && (
            <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 text-sm ${
                changeType === 'increase' ? 'text-green-600' : 
                changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {changeType === 'increase' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
                ) : changeType === 'decrease' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
              </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                  </svg>
            )}
            <span>{change}</span>
          </div>
              <div className="group relative">
                <Info className="w-3 h-3 text-gray-400 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  Trend based on last {trendPeriod}
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard; 