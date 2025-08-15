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
        {/* Single Form Section */}
        <div className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-8">
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
      </div>
    </div>
  );
};

export default FormLayout; 