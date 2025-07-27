import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  MessageSquare, 
  Briefcase, 
  TrendingUp, 
  Eye, 
  Settings, 
  LogOut,
  UserPlus,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    {
      title: 'Total Job Seekers',
      value: '1,247',
      change: '+23',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Requests',
      value: '18',
      change: '+5',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Successful Matches',
      value: '156',
      change: '+12',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Platform Growth',
      value: '+34%',
      change: '+8%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const recentRequests = [
    {
      id: 1,
      employer: 'TechCorp Rwanda',
      candidate: 'Alice Uwimana',
      position: 'Senior Developer',
      status: 'pending',
      date: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      employer: 'Innovation Labs',
      candidate: 'Jean Pierre Ndayisaba',
      position: 'Data Scientist',
      status: 'approved',
      date: '1 day ago',
      priority: 'medium'
    },
    {
      id: 3,
      employer: 'Digital Solutions',
      candidate: 'Marie Claire Uwineza',
      position: 'UX Designer',
      status: 'pending',
      date: '2 days ago',
      priority: 'low'
    }
  ];

  const recentJobSeekers = [
    {
      id: 1,
      name: 'Emmanuel Niyonshuti',
      title: 'Product Manager',
      location: 'Kigali, Rwanda',
      experience: 4,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Sarah Mukamana',
      title: 'Marketing Specialist',
      location: 'Kigali, Rwanda',
      experience: 2,
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'David Nshuti',
      title: 'DevOps Engineer',
      location: 'Kigali, Rwanda',
      experience: 3,
      status: 'inactive',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'approved': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">JobPortal Admin</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar 
                  src={user?.avatar} 
                  alt={user?.name} 
                  size="sm"
                  fallback={user?.name}
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage job seekers, handle employer requests, and monitor platform activity.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Employer Requests */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Employer Requests</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{request.employer}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        size="sm"
                        className={getStatusColor(request.status)}
                      >
                        {request.status}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        size="sm"
                        className={getPriorityColor(request.priority)}
                      >
                        {request.priority}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Requesting: <span className="font-medium">{request.candidate}</span> for {request.position}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{request.date}</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Job Seekers */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Job Seekers</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentJobSeekers.map((jobSeeker) => (
                <div key={jobSeeker.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                  <Avatar 
                    src={jobSeeker.avatar} 
                    alt={jobSeeker.name} 
                    size="md"
                    fallback={jobSeeker.name}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{jobSeeker.name}</h3>
                    <p className="text-sm text-gray-600">{jobSeeker.title}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">{jobSeeker.location}</span>
                      <span className="text-xs text-gray-500">{jobSeeker.experience} years</span>
                      <Badge 
                        variant="outline" 
                        size="sm"
                        className={getStatusColor(jobSeeker.status)}
                      >
                        {jobSeeker.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col">
              <Users className="w-6 h-6 mb-2" />
              <span>Manage Job Seekers</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <MessageSquare className="w-6 h-6 mb-2" />
              <span>View Messages</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <FileText className="w-6 h-6 mb-2" />
              <span>Generate Reports</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard; 