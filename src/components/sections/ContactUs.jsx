import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { submitContact } from '../../api/services/contactService';

// Static data moved from mockData.js
const contactInfo = [
  {
    id: 1,
    title: 'Email',
    value: 'info@jobportal.com',
    description: 'Send us an email anytime',
    icon: 'Mail'
  },
  {
    id: 2,
    title: 'Phone',
    value: '+250 789 123 456',
    description: 'Call us during business hours',
    icon: 'Phone'
  },
  {
    id: 3,
    title: 'Address',
    value: 'Kigali, Rwanda',
    description: 'Visit our office',
    icon: 'MapPin'
  },
  {
    id: 4,
    title: 'Business Hours',
    value: 'Monday - Friday: 8:00 AM - 6:00 PM',
    description: 'We\'re here to help',
    icon: 'Clock'
  }
];

const ContactUs = () => {
  const { t } = useTranslation();

  // Error handling for translation
  const safeTranslate = (key, fallback) => {
    try {
      return t(key, fallback);
    } catch (error) {
      console.error(`Translation error for key: ${key}`, error);
      return fallback;
    }
  };
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setSubmitError('');
    setIsSubmitting(true);
    
    try {
      console.log('📧 Submitting contact form:', formData);
      
      const result = await submitContact(formData);
      
      if (result.success) {
        console.log('✅ Contact message submitted successfully:', result.data);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
      } else {
        console.error('❌ Contact submission failed:', result.error);
        setSubmitError(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error submitting contact form:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderIcon = (iconName) => {
    const icons = { Mail, Phone, MapPin, Clock };
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {safeTranslate('contact.title', 'Contact Us')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {safeTranslate('contact.subtitle', 'Get in touch with us. We\'d love to hear from you and answer any questions you might have.')}
          </p>
        </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contact.info.title', 'Get in Touch')}
              </h3>
              <p className="text-gray-600 mb-8">
                {t('contact.info.description', 'We\'re here to help and answer any questions you might have. We look forward to hearing from you.')}
              </p>
            </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {/* Contact Information */}
          <motion.div variants={itemVariants} className="space-y-8">

            <div className="space-y-6">
              {contactInfo.map((info) => (
                <motion.div
                  key={info.id}
                  className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="text-red-600">
                      {renderIcon(info.icon)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t(`contact.info.${info.id}.title`, info.title)}
                    </h4>
                    <p className="text-gray-600 mb-1">
                      {t(`contact.info.${info.id}.value`, info.value)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t(`contact.info.${info.id}.description`, info.description)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={itemVariants}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50 rounded-xl p-8 contact-form"
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.name', 'Full Name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                    placeholder={t('contact.form.namePlaceholder', 'Enter your full name')}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.email', 'Email Address')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                    placeholder={t('contact.form.emailPlaceholder', 'Enter your email address')}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.subject', 'Subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500"
                    placeholder={t('contact.form.subjectPlaceholder', 'Enter subject')}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.message', 'Message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200 resize-none text-gray-900 placeholder-gray-500"
                    placeholder={t('contact.form.messagePlaceholder', 'Enter your message')}
                  />
                </div>

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 text-sm">{submitError}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t('contact.form.sending', 'Sending...')}
                    </>
                  ) : (
                    <>
                  <Send className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                  {t('contact.form.submit', 'Send Message')}
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('contact.success.title', 'Message Sent Successfully!')}
                </h3>
                <p className="text-gray-600">
                  {t('contact.success.message', 'Thank you for your message. We\'ll get back to you as soon as possible.')}
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactUs; 