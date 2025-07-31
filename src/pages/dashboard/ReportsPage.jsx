import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  AlertCircle,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { jobSeekersData } from '../../data/mockData';

const ReportsPage = () => {
  const { t } = useTranslation();
  
  // State management
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for reports
  const mockReportData = {
    overview: {
      totalJobSeekers: 847,
      avgRating: 4.7,
      growthRate: 12.5
    },
    performance: {
      topCategories: [
        { name: 'Domestic & Household', jobSeekers: 82, growth: 15.2 },
        { name: 'Care Services', jobSeekers: 58, growth: 12.8 },
        { name: 'Food & Hospitality', jobSeekers: 47, growth: 8.5 },
        { name: 'Maintenance & Services', jobSeekers: 28, growth: 18.3 },
        { name: 'Transportation', jobSeekers: 19, growth: 22.1 }
      ]
    },
    requests: [
      { id: 1, name: 'John Doe', category: 'Domestic', status: 'pending' },
      { id: 2, name: 'Jane Smith', category: 'Care', status: 'in_progress' },
      { id: 3, name: 'Peter Jones', category: 'Food', status: 'completed' },
      { id: 4, name: 'Mary Brown', category: 'Maintenance', status: 'pending' },
      { id: 5, name: 'David Lee', category: 'Transport', status: 'in_progress' },
      { id: 6, name: 'Lisa Wilson', category: 'Domestic', status: 'completed' },
      { id: 7, name: 'Michael Davis', category: 'Care', status: 'pending' },
      { id: 8, name: 'Emily White', category: 'Food', status: 'in_progress' },
      { id: 9, name: 'James Black', category: 'Maintenance', status: 'completed' },
      { id: 10, name: 'Olivia Green', category: 'Transport', status: 'pending' },
    ]
  };

  // Period options
  const periodOptions = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  // Category options
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'domestic', label: 'Domestic & Household' },
    { value: 'care', label: 'Care Services' },
    { value: 'food', label: 'Food & Hospitality' },
    { value: 'maintenance', label: 'Maintenance & Services' },
    { value: 'transport', label: 'Transportation' }
  ];

  // Event handlers
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // In a real app, this would fetch new data
    // Period changed
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // In a real app, this would filter data
    // Category changed
  };

  const handleExportReport = (type) => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      // Exporting report
      setIsLoading(false);
      alert(`${type} report exported successfully!`);
    }, 2000);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      // Data refreshed
      setIsLoading(false);
    }, 1500);
  };

  // Simple pie chart component
  const PieChartComponent = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={item.color}
                stroke="white"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
        </div>
      </div>
    );
  };
// fjghjfbhj
  // Statistics calculation
  const stats = [
    {
      title: 'Total Job Seekers',
      value: mockReportData.overview.totalJobSeekers.toString(),
      change: '+12',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'All registered job seekers'
    },
    {
      title: 'Success Rate',
      value: '92%',
      change: '+5%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Successful matches'
    },
    {
      title: 'Average Rating',
      value: mockReportData.overview.avgRating.toString(),
      change: '+0.2',
      changeType: 'increase',
      icon: BarChart3,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Employer satisfaction'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Job Seekers</p>
              <p className="text-2xl font-bold text-gray-900">{mockReportData.overview.totalJobSeekers}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+{mockReportData.overview.growthRate}%</span>
              </div>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">{mockReportData.overview.growthRate}%</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+2.1%</span>
              </div>
            </div>
            <Activity className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{mockReportData.overview.avgRating}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+0.2</span>
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Job Seekers by Category</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('categories')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            {mockReportData.performance.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.jobSeekers} job seekers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{category.jobSeekers} job seekers</p>
                  <p className="text-sm text-green-600">+{category.growth}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('categories')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            {mockReportData.performance.topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.jobSeekers} job seekers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{category.jobSeekers} job seekers</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+{category.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage; 