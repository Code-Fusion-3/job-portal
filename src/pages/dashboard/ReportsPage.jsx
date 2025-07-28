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
  CheckCircle,
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
      activePlacements: 234,
      avgRating: 4.7,
      growthRate: 12.5
    },
    placements: {
      monthly: [45, 52, 48, 67, 58, 72, 65, 78, 82, 75, 89, 92],
      categories: [
        { name: 'Domestic & Household', value: 35, color: '#3B82F6' },
        { name: 'Care Services', value: 25, color: '#EC4899' },
        { name: 'Food & Hospitality', value: 20, color: '#F59E0B' },
        { name: 'Maintenance & Services', value: 12, color: '#10B981' },
        { name: 'Transportation', value: 8, color: '#8B5CF6' }
      ]
    },
    performance: {
      topPerformers: [
        { name: 'Francine Mukamana', category: 'Domestic', placements: 12, rating: 4.9 },
        { name: 'Marie Claire Uwineza', category: 'Care', placements: 10, rating: 4.8 },
        { name: 'Jean Pierre Ndayisaba', category: 'Transport', placements: 8, rating: 4.7 },
        { name: 'Emmanuel Niyonshuti', category: 'Maintenance', placements: 7, rating: 4.6 },
        { name: 'Sarah Mukamana', category: 'Food', placements: 6, rating: 4.5 }
      ],
      topCategories: [
        { name: 'Domestic & Household', placements: 82, growth: 15.2 },
        { name: 'Care Services', placements: 58, growth: 12.8 },
        { name: 'Food & Hospitality', placements: 47, growth: 8.5 },
        { name: 'Maintenance & Services', placements: 28, growth: 18.3 },
        { name: 'Transportation', placements: 19, growth: 22.1 }
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
    console.log('Period changed to:', period);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // In a real app, this would filter data
    console.log('Category changed to:', category);
  };

  const handleExportReport = (type) => {
    setIsLoading(true);
    // Simulate export process
    setTimeout(() => {
      console.log(`Exporting ${type} report...`);
      setIsLoading(false);
      alert(`${type} report exported successfully!`);
    }, 2000);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      console.log('Data refreshed');
      setIsLoading(false);
    }, 1500);
  };

  // Simple chart component for placement trend
  const PlacementChart = ({ data }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    
    return (
      <div className="h-64 flex items-end justify-between space-x-1">
        {data.map((value, index) => {
          const height = ((value - minValue) / (maxValue - minValue)) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t"
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">{index + 1}</span>
            </div>
          );
        })}
      </div>
    );
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
      title: 'Active Placements',
      value: mockReportData.overview.activePlacements.toString(),
      change: '+8',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Currently ongoing'
    },
    {
      title: 'Success Rate',
      value: '92%',
      change: '+5%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Successful placements'
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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => handleExportReport('comprehensive')}
            disabled={isLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

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
              <p className="text-sm font-medium text-gray-600">Active Placements</p>
              <p className="text-2xl font-bold text-gray-900">{mockReportData.overview.activePlacements}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8.2%</span>
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
        {/* Placement Trend */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Placement Trend</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('placements')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <PlacementChart data={mockReportData.placements.monthly} />
          <div className="mt-4 text-center text-sm text-gray-500">
            Monthly placements
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Placements by Category</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('categories')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <PieChartComponent data={mockReportData.placements.categories} />
          <div className="mt-4 space-y-2">
            {mockReportData.placements.categories.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Job Seekers</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('performers')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="space-y-4">
            {mockReportData.performance.topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{performer.name}</p>
                    <p className="text-sm text-gray-500">{performer.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{performer.placements} placements</p>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-yellow-600">★</span>
                    <span className="text-sm text-gray-600 ml-1">{performer.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

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
                    <p className="text-sm text-gray-500">{category.placements} placements</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{category.placements} placements</p>
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

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Report Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-16 flex-col"
            onClick={() => handleExportReport('monthly-summary')}
          >
            <FileText className="w-6 h-6 mb-2" />
            <span>Monthly Summary</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col"
            onClick={() => handleExportReport('performance-analysis')}
          >
            <BarChart3 className="w-6 h-6 mb-2" />
            <span>Performance Analysis</span>
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-col"
            onClick={() => handleExportReport('placement-report')}
          >
            <CheckCircle className="w-6 h-6 mb-2" />
            <span>Placement Report</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage; 