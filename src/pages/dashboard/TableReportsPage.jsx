import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  MessageSquare, 
  Briefcase, 
  MapPin,
  Activity,
  Download,
  RefreshCw,
  FileText
} from 'lucide-react';
import { adminService } from '../../api/services/adminService';
import { useAdminJobSeekers } from '../../api/hooks/useJobSeekers';
import { useAdminRequests } from '../../api/hooks/useRequests';
import { useCategories } from '../../api/hooks/useCategories';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import DataTable from '../../components/ui/DataTable';

const TableReportsPage = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [activeReport, setActiveReport] = useState('job-seekers'); // Default to job seekers
  const [searchTerm, setSearchTerm] = useState(''); // Add search state

  // Use hooks to fetch complete data
  const {
    jobSeekers: allJobSeekers,
    loading: jobSeekersLoading,
    error: jobSeekersError,
    fetchJobSeekers
  } = useAdminJobSeekers({ 
    autoFetch: true,
    itemsPerPage: 1000 // Get all job seekers
  });

  const {
    requests: allRequests,
    loading: requestsLoading,
    error: requestsError,
    fetchRequests
  } = useAdminRequests({ 
    autoFetch: true,
    itemsPerPage: 1000 // Get all requests
  });

  const {
    categories: allCategories,
    loading: categoriesLoading,
    error: categoriesError,
    fetchCategories
  } = useCategories({ 
    includeAdmin: true,
    autoFetch: true
  });

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError('');
      
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
      }
    } catch (error) {
      console.error('Error loading report data:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const periodOptions = [
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: '365', label: 'Last Year' }
  ];

  const reportOptions = [
    { value: 'job-seekers', label: 'Job Seekers', icon: Users },
    { value: 'employer-requests', label: 'Employer Requests', icon: MessageSquare },
    { value: 'categories', label: 'Categories', icon: Briefcase },
    { value: 'locations', label: 'Locations', icon: MapPin },
    { value: 'skills', label: 'Skills', icon: Activity }
  ];

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
        const pdfContent = result.data;
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename || `table-report-${type}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert(`${type} table report exported successfully as PDF!`);
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
      await Promise.all([
        loadReportData(),
        fetchJobSeekers(),
        fetchRequests(),
        fetchCategories()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Table data preparation functions - now using complete data
  const prepareJobSeekersTableData = () => {
    if (!allJobSeekers || allJobSeekers.length === 0) return [];
    
    return allJobSeekers.map(seeker => ({
      id: seeker.id,
      name: `${seeker.profile?.firstName || seeker.firstName || seeker.name || 'Unknown'} ${seeker.profile?.lastName || seeker.lastName || ''}`,
      email: seeker.email || seeker.profile?.email || 'Not provided',
      phone: seeker.profile?.contactNumber || seeker.contactNumber || seeker.phone || 'Not provided',
      location: seeker.profile?.location || seeker.location || seeker.city || 'Not specified',
      category: seeker.profile?.jobCategory?.name_en || seeker.jobCategory?.name_en || seeker.category || 'Not specified',
      experience: seeker.profile?.experienceLevel || seeker.experienceLevel || seeker.experience || 'Not specified',
      registeredAt: seeker.registeredAt || seeker.createdAt ? new Date(seeker.registeredAt || seeker.createdAt).toLocaleDateString() : 'Unknown',
      status: seeker.status || 'Active'
    }));
  };

  const prepareEmployerRequestsTableData = () => {
    if (!allRequests || allRequests.length === 0) return [];
    
    return allRequests.map(request => ({
      id: request.id,
      employerName: request.employerName || request.employer?.name || 'Unknown',
      companyName: request.companyName || request.employer?.company || 'Private',
      position: request.position || request.jobTitle || 'General',
      status: request.status || 'pending',
      priority: request.priority || 'normal',
      monthlyRate: request.monthlyRate ? `${request.monthlyRate.toLocaleString()} RWF` : 'Not specified',
      createdAt: request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Unknown',
      contactEmail: request.employerContact?.email || request.employer?.email || 'Not provided'
    }));
  };

  const prepareCategoriesTableData = () => {
    if (!allCategories || allCategories.length === 0) return [];
    
    // Count job seekers per category
    const categoryCounts = {};
    allJobSeekers?.forEach(seeker => {
      const category = seeker.profile?.jobCategory?.name_en || seeker.jobCategory?.name_en || seeker.category || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    return allCategories.map(category => {
      const count = categoryCounts[category.name_en] || 0;
      const total = allJobSeekers?.length || 1;
      const percentage = Math.round((count / total) * 100);
      
      return {
        id: category.id,
        name: category.name_en || category.name,
        count: count,
        percentage: percentage,
        status: 'Active'
      };
    });
  };

  const prepareLocationsTableData = () => {
    if (!allJobSeekers || allJobSeekers.length === 0) return [];
    
    // Count job seekers per location
    const locationCounts = {};
    allJobSeekers.forEach(seeker => {
      const location = seeker.profile?.location || seeker.location || seeker.city || 'Unknown';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    return Object.entries(locationCounts).map(([location, count]) => {
      const total = allJobSeekers.length;
      const percentage = Math.round((count / total) * 100);
      
      return {
        id: location,
        name: location,
        count: count,
        percentage: percentage,
        status: 'Active'
      };
    }).sort((a, b) => b.count - a.count);
  };

  const prepareSkillsTableData = () => {
    if (!allJobSeekers || allJobSeekers.length === 0) return [];
    
    // Count skills across all job seekers
    const skillCounts = {};
    allJobSeekers.forEach(seeker => {
      const skills = seeker.profile?.skills || seeker.skills || '';
      if (skills) {
        const skillList = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        skillList.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });

    return Object.entries(skillCounts).map(([skill, count]) => {
      const total = allJobSeekers.length;
      const percentage = Math.round((count / total) * 100);
      const demand = count > total * 0.3 ? 'High' : count > total * 0.1 ? 'Medium' : 'Low';
      
      return {
        id: skill,
        name: skill,
        count: count,
        percentage: percentage,
        demand: demand
      };
    }).sort((a, b) => b.count - a.count);
  };

  // Table columns configuration
  const getTableColumns = (reportType) => {
    switch (reportType) {
      case 'job-seekers':
        return [
          { key: 'name', label: 'Name', sortable: true },
          { key: 'email', label: 'Email', sortable: true },
          { key: 'phone', label: 'Phone', sortable: true },
          { key: 'location', label: 'Location', sortable: true },
          { key: 'category', label: 'Category', sortable: true },
          { key: 'experience', label: 'Experience', sortable: true },
          { key: 'registeredAt', label: 'Registered', sortable: true },
          { key: 'status', label: 'Status', sortable: true, render: (item) => (
            <Badge variant={item.status === 'Active' ? 'success' : 'warning'}>
              {item.status}
            </Badge>
          )}
        ];
      
      case 'employer-requests':
        return [
          { key: 'employerName', label: 'Employer', sortable: true },
          { key: 'companyName', label: 'Company', sortable: true },
          { key: 'position', label: 'Position', sortable: true },
          { key: 'status', label: 'Status', sortable: true, render: (item) => (
            <Badge variant={
              item.status === 'completed' ? 'success' :
              item.status === 'in_progress' ? 'warning' :
              item.status === 'pending' ? 'info' : 'danger'
            }>
              {item.status.replace('_', ' ')}
            </Badge>
          )},
          { key: 'priority', label: 'Priority', sortable: true, render: (item) => (
            <Badge variant={
              item.priority === 'urgent' ? 'danger' :
              item.priority === 'high' ? 'warning' :
              item.priority === 'normal' ? 'info' : 'secondary'
            }>
              {item.priority}
            </Badge>
          )},
          { key: 'monthlyRate', label: 'Monthly Rate', sortable: true },
          { key: 'createdAt', label: 'Created', sortable: true },
          { key: 'contactEmail', label: 'Contact Email', sortable: true }
        ];
      
      case 'categories':
        return [
          { key: 'name', label: 'Category Name', sortable: true },
          { key: 'count', label: 'Job Seekers', sortable: true },
          { key: 'percentage', label: 'Percentage', sortable: true, render: (item) => (
            <span>{item.percentage}%</span>
          )},
          { key: 'status', label: 'Status', sortable: true, render: (item) => (
            <Badge variant="success">{item.status}</Badge>
          )}
        ];
      
      case 'locations':
        return [
          { key: 'name', label: 'Location', sortable: true },
          { key: 'count', label: 'Job Seekers', sortable: true },
          { key: 'percentage', label: 'Percentage', sortable: true, render: (item) => (
            <span>{item.percentage}%</span>
          )},
          { key: 'status', label: 'Status', sortable: true, render: (item) => (
            <Badge variant="success">{item.status}</Badge>
          )}
        ];
      
      case 'skills':
        return [
          { key: 'name', label: 'Skill Name', sortable: true },
          { key: 'count', label: 'Count', sortable: true },
          { key: 'percentage', label: 'Percentage', sortable: true, render: (item) => (
            <span>{item.percentage}%</span>
          )},
          { key: 'demand', label: 'Demand Level', sortable: true, render: (item) => (
            <Badge variant={
              item.demand === 'High' ? 'success' :
              item.demand === 'Medium' ? 'warning' : 'info'
            }>
              {item.demand}
            </Badge>
          )}
        ];
      
      default:
        return [];
    }
  };

  const getReportData = (reportType) => {
    switch (reportType) {
      case 'job-seekers':
        return prepareJobSeekersTableData();
      case 'employer-requests':
        return prepareEmployerRequestsTableData();
      case 'categories':
        return prepareCategoriesTableData();
      case 'locations':
        return prepareLocationsTableData();
      case 'skills':
        return prepareSkillsTableData();
      default:
        return [];
    }
  };

  const getReportTitle = (reportType) => {
    const option = reportOptions.find(opt => opt.value === reportType);
    return option ? option.label : 'Report';
  };

  if (loading || jobSeekersLoading || requestsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" text="Loading table reports..." />
      </div>
    );
  }

  if (error || jobSeekersError || requestsError || categoriesError) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Table Reports</h3>
          <p className="text-red-600 mb-4">{error || jobSeekersError || requestsError || categoriesError}</p>
          <Button onClick={handleRefreshData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table Reports</h1>
        </div>
      </div>

      {/* Report Navigation Grid */}
        <Card className="">
            {/* <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Report Type</h2> */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                                <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
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
                        {reportOptions.map((option) => {
                        const IconComponent = option.icon;
                        const isActive = activeReport === option.value;
                        
                    return (
                    <button
                        key={option.value}
                        onClick={() => setActiveReport(option.value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                        isActive
                            ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        >
                        <div className="flex flex-col items-center space-y-2">
                        <IconComponent className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium text-center">{option.label}</span>
                        </div>
                    </button>
                    );
                    })}
                </div>
        </Card>

      {/* Main Content Area - Selected Report */}
      {activeReport && (
        <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                <h2 className="text-xl font-semibold text-gray-900">{getReportTitle(activeReport)}</h2>
                <p className="text-gray-600">Comprehensive data table for {getReportTitle(activeReport).toLowerCase()}</p>
                </div>
                <Button
                onClick={() => handleExportReport(activeReport)}
                disabled={isLoading}
                className="flex items-center gap-2"
                >
                <Download className="w-3 h-3" />
                {isLoading ? 'Exporting...' : 'Export PDF'}
                </Button>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={handleRefreshData}
                        variant="outline"
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                        {isLoading ? 'Refreshing...' : 'Refresh'}
                    </Button>
                    
                </div>
            </div>
          
            <div className="overflow-x-auto">
                                 <DataTable
                 columns={getTableColumns(activeReport)}
                 data={getReportData(activeReport)}
                 pagination={true}
                 itemsPerPage={15}
                 searchTerm={searchTerm}
                 onSearchChange={setSearchTerm}
                 className="w-full"
                 />
            </div>
        </Card>
      )}
    </div>
  );
};

export default TableReportsPage; 