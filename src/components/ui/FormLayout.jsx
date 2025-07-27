import { motion } from 'framer-motion';

const FormLayout = ({
  title,
  subtitle,
  children,
  onSubmit,
  loading = false,
  submitText = 'Submit',
  loadingText = 'Loading...',
  className = '',
  ...props
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen pt-16">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-lg w-full space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {title}
                </h2>
                {subtitle && (
                  <p className="text-gray-600">
                    {subtitle}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border p-8"
            >
              <form onSubmit={onSubmit} className="space-y-6" {...props}>
                {children}
              </form>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Hero Section */}
        <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-red-600 to-red-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative z-10 flex items-center justify-center px-8">
            <div className="text-center text-white">
              <h3 className="text-3xl font-bold mb-4">
                Welcome to Job Portal
              </h3>
              <p className="text-xl text-red-100 max-w-md">
                Connect with top talent and opportunities. Start your journey today and discover endless possibilities.
              </p>
              
              {/* Benefits List */}
              <div className="mt-8 space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-red-100">Access to thousands of job opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-red-100">Connect with top employers and talent</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-red-100">Advanced matching algorithms</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-red-100">Professional profile management</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default FormLayout; 