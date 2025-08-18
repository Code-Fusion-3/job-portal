import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LiveUpdateProvider } from './contexts/LiveUpdateContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SessionMonitor from './components/auth/SessionMonitor';
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import LatestJobSeekers from './components/sections/LatestJobSeekers';
import Statistics from './components/sections/Statistics';

import Footer from './components/layout/Footer';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import JobSeekers from './pages/JobSeekers';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import EmployerRequest from './pages/EmployerRequest';
import JobSeekerDashboard from './pages/dashboard/JobSeekerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import JobSeekersPage from './pages/dashboard/JobSeekersPage';
import JobCategoriesPage from './pages/dashboard/JobCategoriesPage';
import EmployerRequestsPage from './pages/dashboard/EmployerRequestsPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import ViewProfile from './pages/ViewProfile';
import UpdateProfile from './pages/UpdateProfile';
import AboutUsPage from './pages/AboutUs';
import ContactUsPage from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import './App.css';

  // Starting full application

// Error Boundary Component
const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error('Error caught by boundary:', error, errorInfo);
      setHasError(true);
      setError(error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">
            We encountered an error while loading the application. Please try refreshing the page.
          </p>
          {error && (
            <details className="text-sm text-gray-500">
              <summary className="cursor-pointer">Error details</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                {error.toString()}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return children;
};

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading Job Portal...</p>
    </div>
  </div>
);

// Home page component
const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
      // Component starting to render

  let containerRef = null;
  
  try {
    const scrollAnimations = useScrollAnimations();
    containerRef = scrollAnimations.containerRef;
    // Scroll animations hook initialized
  } catch (error) {
    console.error('HomePage: Error initializing scroll animations:', error);
  }



  useEffect(() => {
    // Component mounted, setting loading to false
    setIsLoading(false);
  }, []);

  if (isLoading) {
    // Showing loading spinner
    return <LoadingSpinner />;
  }

  if (error) {
    console.error('HomePage: Error occurred:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Homepage</h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

      // Rendering main content
  
  try {
    return (
      <motion.div
        ref={containerRef}
        className="min-h-screen bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Header />
        <main className="w-full">
          <Hero />
          <Features />
          <LatestJobSeekers />
          {/* <Statistics /> */}
        </main>
        <Footer />
      </motion.div>
    );
  } catch (error) {
    console.error('HomePage: Error rendering main content:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Rendering Content</h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }
};

function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const [appError, setAppError] = useState(null);

      // Component starting to render

  useEffect(() => {
    // Initializing application
    
    try {
      // Check if required dependencies are available
      if (typeof window === 'undefined') {
        throw new Error('Window object not available');
      }

      // Check if React Router is working
      if (!window.location) {
        throw new Error('Location object not available');
      }

              // All dependencies available, setting ready state
      setIsAppReady(true);
      
    } catch (error) {
      console.error('App: Error during initialization:', error);
      setAppError(error);
    }
  }, []);

  if (appError) {
    console.error('App: Fatal error:', appError);
  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-600 mb-4">
            Failed to initialize the application. Please check your browser console for more details.
          </p>
          <details className="text-sm text-gray-500">
            <summary className="cursor-pointer">Error details</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {appError.toString()}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  if (!isAppReady) {
    // Application not ready, showing loading
    return <LoadingSpinner />;
  }

      // Application ready, rendering router

  try {
    return (
      <ErrorBoundary>
        <AuthProvider>
          <LiveUpdateProvider>
            <Router>
              <SessionMonitor />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/job-seekers" element={<JobSeekers />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/register" element={<Register />} />
                <Route path="/employer-request/:id" element={<EmployerRequest />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard/jobseeker" element={
                  <ProtectedRoute requiredRole="jobseeker">
                    <JobSeekerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/jobseekers" element={
                  <ProtectedRoute requiredRole="admin">
                    <JobSeekersPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/job-categories" element={
                  <ProtectedRoute requiredRole="admin">
                    <JobCategoriesPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/employer-requests" element={
                  <ProtectedRoute requiredRole="admin">
                    <EmployerRequestsPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/reports" element={
                  <ProtectedRoute requiredRole="admin">
                    <ReportsPage />
                  </ProtectedRoute>
                } />
                <Route path="/view-profile/:id" element={<ViewProfile />} />
                <Route path="/update-profile" element={
                  <ProtectedRoute requiredRole="jobseeker">
                    <UpdateProfile />
                  </ProtectedRoute>
                } />
           
                {/* Catch-all route for 404 errors */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </LiveUpdateProvider>
        </AuthProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('App: Error rendering router:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Router Error</h1>
          <p className="text-gray-600 mb-4">
            Failed to render the application router. Please check your browser console for more details.
          </p>
          <details className="text-sm text-gray-500">
            <summary className="cursor-pointer">Error details</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {error.toString()}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}

export default App;
