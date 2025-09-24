import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Search, 
  ArrowLeft, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const quickLinks = [
    {
      title: 'Home',
      description: 'Return to the main page',
      icon: Home,
      path: '/',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Job Seekers',
      description: 'Browse available workers',
      icon: Users,
      path: '/job-seekers',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Search',
      description: 'Find specific services',
      icon: Search,
      path: '/job-seekers',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BC P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Braziconnect Portal Rwanda</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <Card className="p-8 md:p-12">
            <div className="text-center mb-8">
              {/* 404 Icon */}
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-12 h-12 text-red-600" />
              </div>

              {/* Error Code */}
              <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">
                404
              </h1>

              {/* Error Message */}
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                Page Not Found
              </h2>
              
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  variant="primary"
                  onClick={handleGoBack}
                  className="flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Page
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                Quick Navigation
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.path}
                    className="group block p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${link.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <link.icon className={`w-6 h-6 ${link.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                          {link.title}
                        </h4>
                        <p className="text-sm text-gray-600 group-hover:text-gray-500 transition-colors">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Need Help?
              </h3>
              <p className="text-blue-800 mb-4">
                If you're having trouble finding what you're looking for, you can:
              </p>
              <ul className="text-blue-800 space-y-2 text-sm">
                <li>• Check the URL for typos</li>
                <li>• Use the search function to find specific services</li>
                <li>• Browse our job seekers directory</li>
                <li>• Contact our support team</li>
              </ul>
            </div>
          </Card>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2025 Braziconnect Portal Rwanda. All rights reserved.
            </p>
            <div className="mt-4 space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/job-seekers" className="text-gray-600 hover:text-gray-900">Job Seekers</Link>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound; 