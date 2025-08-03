import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import LatestJobSeekers from './components/sections/LatestJobSeekers';
import AboutUs from './components/sections/AboutUs';
import ContactUs from './components/sections/ContactUs';
import Footer from './components/layout/Footer';
import JobSeekers from './pages/JobSeekers';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployerRequest from './pages/EmployerRequest';
import JobSeekerDashboard from './pages/dashboard/JobSeekerDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ViewProfile from './pages/ViewProfile';
import UpdateProfile from './pages/UpdateProfile';
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

  // Smooth scrolling for anchor links
  useEffect(() => {
    // Setting up smooth scrolling
    
    try {
      const handleAnchorClick = (e) => {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }
      };

      document.addEventListener('click', handleAnchorClick);
      return () => document.removeEventListener('click', handleAnchorClick);
    } catch (error) {
      console.error('HomePage: Error setting up smooth scrolling:', error);
    }
  }, []);

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
          <AboutUs />
          <ContactUs />
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
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/job-seekers" element={<JobSeekers />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/employer-request/:id" element={<EmployerRequest />} />
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
