import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter,
  RefreshCw,
  Activity
} from 'lucide-react';
import { adminService } from '../../api/services/adminService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  GrowthChart, 
  CategoriesChart, 
  LocationsChart, 
  SkillsChart,
  SkillsDoughnutChart,
  CategoriesDoughnutChart
} from '../../components/ui/Charts';

const ReportsPage = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);

  // Load report data
  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

    const loadReportData = async () => {
      try {
        setLoading(true);
      setError('');
      
      // Load both analytics and dashboard stats
      const [analyticsResult, statsResult] = await Promise.all([
        adminService.getAnalytics({ period: selectedPeriod }),
        adminService.getDashboardStats()
      ]);

      if (analyticsResult.success) {
        setReportData(analyticsResult.data);
      } else {
        setError(analyticsResult.error || 'Failed to load analytics data');
      }

      if (statsResult.success) {
        setDashboardStats(statsResult.data);
      } else {
        console.error('Failed to load dashboard stats:', statsResult.error);
      }
      } catch (error) {
        console.error('Error loading report data:', error);
      setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

  // Period options
  const periodOptions = [
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: '365', label: 'Last Year' }
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
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    // In a real app, this would filter data
    // Category changed
  };

  const handleExportReport = async (type) => {
    setIsLoading(true);
    try {
      const result = await adminService.exportSystemData({ 
        type, 
        format: 'pdf',
        startDate: new Date(Date.now() - parseInt(selectedPeriod) * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString()
      });
      
      if (result.success) {
        // Create download link for PDF
        const pdfContent = result.data;
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename || `report-${type}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert(`${type} report exported successfully as PDF!`);
      } else {
        alert(`Failed to export report: ${result.error}`);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error exporting report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      await loadReportData();
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading reports..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Reports</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadReportData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!reportData || !dashboardStats) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Data Available</h3>
          <p className="text-gray-600">There is no data available for the selected period.</p>
        </div>
      </div>
    );
  }

  // Calculate growth rates
  const calculateGrowthRate = (data) => {
    if (!data || data.length < 2) return 0;
    const recent = data.slice(-7).reduce((sum, item) => sum + item.count, 0);
    const previous = data.slice(-14, -7).reduce((sum, item) => sum + item.count, 0);
    if (previous === 0) return recent > 0 ? 100 : 0;
    return Math.round(((recent - previous) / previous) * 100);
  };

  const jobSeekerGrowth = calculateGrowthRate(reportData.growth?.jobSeekers);
  const requestGrowth = calculateGrowthRate(reportData.growth?.employerRequests);

  // Statistics calculation
  const stats = [
    {
      title: 'Total Job Seekers',
      value: dashboardStats.overview?.totalJobSeekers?.toString() || '0',
      change: jobSeekerGrowth > 0 ? `+${jobSeekerGrowth}%` : `${jobSeekerGrowth}%`,
      changeType: jobSeekerGrowth >= 0 ? 'increase' : 'decrease',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'All registered job seekers'
    },
    {
      title: 'Total Requests',
      value: dashboardStats.overview?.totalEmployerRequests?.toString() || '0',
      change: requestGrowth > 0 ? `+${requestGrowth}%` : `${requestGrowth}%`,
      changeType: requestGrowth >= 0 ? 'increase' : 'decrease',
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'All employer requests'
    },
    {
      title: 'Pending Requests',
      value: dashboardStats.overview?.pendingEmployerRequests?.toString() || '0',
      change: '',
      changeType: 'neutral',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Requests awaiting response'
    },
    {
      title: 'Categories',
      value: dashboardStats.overview?.totalCategories?.toString() || '0',
      change: '',
      changeType: 'neutral',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Active job categories'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefreshData}
            variant="outline"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {periodOptions.map(option => (
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
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="p-6">
          <div className="flex items-center justify-between">
            <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
              <div className="flex items-center mt-2">
                      {stat.changeType === 'increase' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : stat.changeType === 'decrease' ? (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      ) : null}
                      <span className={`text-sm ${
                        stat.changeType === 'increase' ? 'text-green-600' : 
                        stat.changeType === 'decrease' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
              </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
          </div>
          </div>
        </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Charts */}
        {reportData.growth && (
          <>
            {/* Job Seeker Growth Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Job Seeker Growth</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport('job-seekers')}
                  disabled={isLoading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <div className="h-80">
                <GrowthChart 
                  data={reportData.growth.jobSeekers || []} 
                  title="Job Seeker Growth Trend"
                />
              </div>
            </Card>

            {/* Employer Request Growth Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Employer Request Growth</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportReport('employer-requests')}
                  disabled={isLoading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <div className="h-80">
                <GrowthChart 
                  data={reportData.growth.employerRequests || []} 
                  title="Employer Request Growth Trend"
                />
              </div>
            </Card>
          </>
        )}

        {/* Categories Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Categories</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('categories')}
              disabled={isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
          <div className="h-80">
            <CategoriesChart 
              data={reportData.categories?.top || []} 
              title="Top Job Categories"
            />
                  </div>
        </Card>

        {/* Locations Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Locations</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('locations')}
              disabled={isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
                  </div>
          <div className="h-80">
            <LocationsChart 
              data={reportData.locations || []} 
              title="Geographic Distribution"
            />
          </div>
        </Card>

        {/* Skills Chart */}
        {reportData.skills && reportData.skills.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Skills in Demand</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport('skills')}
                disabled={isLoading}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <div className="h-80">
              <SkillsChart 
                data={reportData.skills.slice(0, 10) || []} 
                title="Most Requested Skills"
              />
            </div>
          </Card>
        )}

        {/* Skills Doughnut Chart */}
        {reportData.skills && reportData.skills.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Skills Distribution</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport('skills')}
                disabled={isLoading}
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <div className="h-80">
              <SkillsDoughnutChart 
                data={reportData.skills.slice(0, 8) || []} 
                title="Skills Distribution"
              />
      </div>
          </Card>
        )}

        {/* Categories Doughnut Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Categories Distribution</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportReport('categories')}
              disabled={isLoading}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
          <div className="h-80">
            <CategoriesDoughnutChart 
              data={reportData.categories?.top?.slice(0, 8) || []} 
              title="Categories Distribution"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage; 