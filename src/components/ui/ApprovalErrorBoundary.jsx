import React from 'react';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';
import Card from './Card';

class ApprovalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ApprovalErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      hasError: true
    });

    // You can also log the error to an error reporting service here
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, retryCount } = this.state;
      const { fallback: CustomFallback, showDetails = false } = this.props;

      // If a custom fallback is provided, use it
      if (CustomFallback) {
        return (
          <CustomFallback
            error={error}
            errorInfo={errorInfo}
            retry={this.handleRetry}
            retryCount={retryCount}
          />
        );
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-4">
                An error occurred in the approval system. This might be a temporary issue.
              </p>
              {retryCount > 0 && (
                <p className="text-sm text-gray-500 mb-4">
                  Retry attempts: {retryCount}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={this.handleRetry}
                variant="primary"
                className="flex items-center justify-center gap-2"
                disabled={retryCount >= 3}
              >
                <RefreshCw className="w-4 h-4" />
                {retryCount >= 3 ? 'Max retries reached' : 'Try Again'}
              </Button>
              
              <Button
                as={Link}
                to="/"
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Homepage
              </Button>
              
              <Button
                as={Link}
                to="/contact"
                variant="outline"
                className="flex items-center justify-center gap-2 text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </Button>
            </div>

            {showDetails && error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                  Technical Details
                </summary>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Error:</h3>
                  <p className="text-sm text-gray-700 mb-4 font-mono">
                    {error.toString()}
                  </p>
                  
                  {errorInfo && (
                    <>
                      <h3 className="font-medium text-gray-900 mb-2">Stack Trace:</h3>
                      <pre className="text-xs text-gray-600 overflow-auto bg-white p-2 rounded border">
                        {errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If this problem persists, please contact our support team with the error details above.
              </p>
            </div>
          </Card>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ApprovalErrorBoundary;
