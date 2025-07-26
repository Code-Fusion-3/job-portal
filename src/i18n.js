import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.register': 'Register',
      'nav.login': 'Login',
      'nav.viewJobSeekers': 'View Job Seekers',
      'nav.language': 'Language',
      
      // Hero Section
      'hero.title': 'Connect Talent with Opportunity',
      'hero.subtitle': 'The premier platform connecting skilled job seekers with forward-thinking employers in Rwanda',
      'hero.cta.register': 'Get Started',
      'hero.cta.browse': 'Browse Candidates',
      'hero.cta.learn': 'Learn More',
      
      // Features Section
      'features.title': 'Why Choose Our Platform',
      'features.subtitle': 'Empowering job seekers and employers with innovative solutions',
      'features.jobSeekers.title': 'For Job Seekers',
      'features.jobSeekers.desc': 'Create your professional profile and connect with top employers',
      'features.employers.title': 'For Employers',
      'features.employers.desc': 'Find qualified candidates and streamline your hiring process',
      'features.privacy.title': 'Privacy First',
      'features.privacy.desc': 'Your data is protected with industry-leading security measures',
      
      // Stats Section
      'stats.title': 'Platform Impact',
      'stats.jobSeekers': 'Job Seekers',
      'stats.employers': 'Employers',
      'stats.successRate': 'Success Rate',
      'stats.companies': 'Companies',
      
      // CTA Section
      'cta.title': 'Ready to Get Started?',
      'cta.subtitle': 'Join thousands of professionals who have found their dream jobs',
      'cta.register': 'Register Now',
      'cta.contact': 'Contact Us',
      
      // Footer
      'footer.description': 'Connecting talent with opportunity across Rwanda',
      'footer.quickLinks': 'Quick Links',
      'footer.contact': 'Contact',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',
      'footer.copyright': '© 2024 Job Portal. All rights reserved.',
    }
  },
  rw: {
    translation: {
      // Navigation
      'nav.home': 'Ahabanza',
      'nav.register': 'Kwiyandikisha',
      'nav.login': 'Kwinjira',
      'nav.viewJobSeekers': 'Reba Abashaka Akazi',
      'nav.language': 'Ururimi',
      
      // Hero Section
      'hero.title': 'Huzuza Ubumenyi n\'Urupfu',
      'hero.subtitle': 'Urupapuro rw\'ibanze ruhuzuza abashaka akazi bafite ubumenyi n\'abakozi ba nyuma mu Rwanda',
      'hero.cta.register': 'Tangira',
      'hero.cta.browse': 'Reba Abantu',
      'hero.cta.learn': 'Menya Birenzeho',
      
      // Features Section
      'features.title': 'Kuberiki Twihitamo Urupapuro Rwacu',
      'features.subtitle': 'Dushoboza abashaka akazi n\'abakozi dushya',
      'features.jobSeekers.title': 'Ku Bashaka Akazi',
      'features.jobSeekers.desc': 'Kora profile yawe ya professional kandi uhuzwe n\'abakozi ba nyuma',
      'features.employers.title': 'Ku Bakozi',
      'features.employers.desc': 'Shakira abantu bafite ubumenyi kandi ufate ibikorwa byawe by\'uburezi',
      'features.privacy.title': 'Ibyangombwa By\'ibanze',
      'features.privacy.desc': 'Amakuru yawe ari mu kurenganwa n\'uburenganzira bw\'ibanze',
      
      // Stats Section
      'stats.title': 'Ingaruka z\'Urupapuro',
      'stats.jobSeekers': 'Abashaka Akazi',
      'stats.employers': 'Abakozi',
      'stats.successRate': 'Igihe Cy\'Intsinzi',
      'stats.companies': 'Amasosiyete',
      
      // CTA Section
      'cta.title': 'Uteguye Gutangira?',
      'cta.subtitle': 'Uhuze ibihumbi by\'abantu b\'umwuga bashakanye akazi kabo k\'ubwishime',
      'cta.register': 'Iyandikishe Ubu',
      'cta.contact': 'Twandikire',
      
      // Footer
      'footer.description': 'Duhuzuza ubumenyi n\'urupfu mu Rwanda yose',
      'footer.quickLinks': 'Inkuru za Vuba',
      'footer.contact': 'Twandikire',
      'footer.privacy': 'Politiki y\'Ibyangombwa',
      'footer.terms': 'Amabwiriza ya Serivisi',
      'footer.copyright': '© 2024 Job Portal. Uburenganzira bwose buraganzwe.',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n; 