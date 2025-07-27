import React from 'react';
import Footer from './Footer';
import MinimalFooter from './MinimalFooter';
import { FooterSection, FooterLink, SocialLink, CompanyLogo, BackToTopButton } from './Footer';

// Documentation component showing different footer usage examples
const FooterExamples = () => {
  return (
    <div className="space-y-12 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Footer Component Examples</h1>
      
      {/* Default Footer */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Default Footer</h2>
        <p className="text-gray-600 mb-4">
          The standard footer with all sections, social links, and back-to-top button.
        </p>
        <div className="border rounded-lg overflow-hidden">
          <Footer />
        </div>
      </section>

      {/* Minimal Footer */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Minimal Footer</h2>
        <p className="text-gray-600 mb-4">
          A compact footer for pages that need less content.
        </p>
        <div className="border rounded-lg overflow-hidden">
          <MinimalFooter showSocialLinks={true} />
        </div>
      </section>

      {/* Extended Footer */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Extended Footer</h2>
        <p className="text-gray-600 mb-4">
          A larger footer with more space and content.
        </p>
        <div className="border rounded-lg overflow-hidden">
          <Footer variant="extended" />
        </div>
      </section>

      {/* Footer without Back to Top */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Footer without Back to Top</h2>
        <p className="text-gray-600 mb-4">
          Footer with the back-to-top button disabled.
        </p>
        <div className="border rounded-lg overflow-hidden">
          <Footer showBackToTop={false} />
        </div>
      </section>

      {/* Individual Components */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Individual Components</h2>
        <p className="text-gray-600 mb-4">
          Examples of using individual footer components.
        </p>
        
        <div className="space-y-6">
          {/* Company Logo */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Company Logo</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <CompanyLogo />
            </div>
          </div>

          {/* Footer Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Footer Section</h3>
            <div className="bg-gray-900 p-4 rounded-lg">
              <FooterSection title="Quick Links">
                <ul className="space-y-2">
                  <li>
                    <FooterLink href="/">Home</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/about">About</FooterLink>
                  </li>
                  <li>
                    <FooterLink href="/contact">Contact</FooterLink>
                  </li>
                </ul>
              </FooterSection>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Social Links</h3>
            <div className="bg-gray-900 p-4 rounded-lg flex space-x-4">
              <SocialLink 
                icon={require('lucide-react').Facebook} 
                href="https://facebook.com" 
                label="Facebook" 
              />
              <SocialLink 
                icon={require('lucide-react').Twitter} 
                href="https://twitter.com" 
                label="Twitter" 
              />
              <SocialLink 
                icon={require('lucide-react').Linkedin} 
                href="https://linkedin.com" 
                label="LinkedIn" 
              />
            </div>
          </div>

          {/* Back to Top Button */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Back to Top Button</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <BackToTopButton />
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Usage Examples</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Basic Usage</h3>
            <pre className="text-sm text-gray-600 overflow-x-auto">
{`import Footer from './components/layout/Footer';

// Default footer
<Footer />

// Minimal footer
<Footer variant="minimal" />

// Extended footer
<Footer variant="extended" />

// Without back to top button
<Footer showBackToTop={false} />

// With custom className
<Footer className="mt-8" />`}
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Minimal Footer Usage</h3>
            <pre className="text-sm text-gray-600 overflow-x-auto">
{`import MinimalFooter from './components/layout/MinimalFooter';

// Basic minimal footer
<MinimalFooter />

// With social links
<MinimalFooter showSocialLinks={true} />

// With custom styling
<MinimalFooter className="mt-8" />`}
            </pre>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Individual Components</h3>
            <pre className="text-sm text-gray-600 overflow-x-auto">
{`import { 
  FooterSection, 
  FooterLink, 
  SocialLink, 
  CompanyLogo, 
  BackToTopButton 
} from './components/layout/Footer';

// Use individual components
<CompanyLogo />
<FooterSection title="Custom Section">
  <FooterLink href="/custom">Custom Link</FooterLink>
</FooterSection>
<SocialLink icon={Facebook} href="https://facebook.com" label="Facebook" />
<BackToTopButton />`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FooterExamples; 