import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.about': 'About us',
      'nav.jobSeekers': 'Job Seekers',
      'nav.contact': 'Contact us',
      'nav.register': 'Register',
      'nav.login': 'Login',
      'nav.language': 'Language',
      'nav.viewJobSeekers': 'View Job Seekers',
      
      // Hero Section
      'hero.title': 'Connect Talent with Opportunity',
      'hero.subtitle': 'The premier platform connecting skilled job seekers with forward-thinking employers in Rwanda',
      'hero.cta.primary': 'Get Started',
      'hero.cta.secondary': 'Browse Candidates',
      'hero.tour': '360° PLATFORM TOUR',
      
      // Features Section
      'features.title': 'Why Choose Our Platform',
      'features.subtitle': 'Empowering job seekers and employers with innovative solutions',
      'features.jobSeekers.title': 'For Job Seekers',
      'features.jobSeekers.desc': 'Create your professional profile and connect with top employers',
      'features.employers.title': 'For Employers',
      'features.employers.desc': 'Find qualified candidates and streamline your hiring process',
      'features.privacy.title': 'Privacy First',
      'features.privacy.desc': 'Your data is protected with industry-leading security measures',
      
      // About Us Section
      'about.title': 'About Us',
      'about.subtitle': 'Connecting talent with opportunity across Rwanda through innovative technology and personalized service.',
      'about.mission.title': 'Our Mission',
      'about.mission.desc': 'To bridge the gap between talented professionals and forward-thinking employers in Rwanda, creating meaningful connections that drive economic growth and personal fulfillment. We believe that every individual deserves the opportunity to find their perfect career match.',
      'about.vision.title': 'Our Vision',
      'about.vision.desc': 'To become Rwanda\'s leading platform for professional development and recruitment, empowering individuals and organizations to achieve their full potential through innovative technology and personalized service.',
      'about.stats.jobSeekers': 'Job Seekers',
      'about.stats.companies': 'Companies',
      'about.stats.successRate': 'Success Rate',
      'about.stats.experience': 'Years Experience',
      'about.values.passion.title': 'Passion for People',
      'about.values.passion.desc': 'We believe in the power of human potential and are committed to helping individuals achieve their career goals.',
      'about.values.trust.title': 'Trust & Security',
      'about.values.trust.desc': 'Your privacy and data security are our top priorities. We maintain the highest standards of protection.',
      'about.values.excellence.title': 'Excellence',
      'about.values.excellence.desc': 'We strive for excellence in everything we do, from platform development to customer service.',
      'about.values.community.title': 'Community',
      'about.values.community.desc': 'Building a strong community of professionals and employers across Rwanda.',
      
      // Latest Job Seekers Section
      'jobSeekers.title': 'Latest Job Seekers',
      'jobSeekers.subtitle': 'Discover talented professionals ready to contribute to your organization\'s success',
      'jobSeekers.viewMore': 'View More',
      'jobSeekers.experience': 'years',
      'jobSeekers.location': 'Kigali, Rwanda',
      
      // Job Seekers Page
      'jobSeekers.pageTitle': 'All Job Seekers',
      'jobSeekers.pageSubtitle': 'Discover talented professionals ready to contribute to your organization',
      'jobSeekers.searchPlaceholder': 'Search by name, title, or skills...',
      'jobSeekers.filters.location': 'Location',
      'jobSeekers.filters.allLocations': 'All Locations',
      'jobSeekers.filters.experience': 'Experience',
      'jobSeekers.filters.allExperience': 'All Experience',
      'jobSeekers.filters.sortBy': 'Sort By',
      'jobSeekers.filters.mostRecent': 'Most Recent',
      'jobSeekers.filters.highestRated': 'Highest Rated',
      'jobSeekers.filters.mostExperienced': 'Most Experienced',
      'jobSeekers.filters.name': 'Name A-Z',
      'jobSeekers.filters.skills': 'Skills',
      'jobSeekers.results': 'results',
      'jobSeekers.noResults.title': 'No job seekers found',
      'jobSeekers.noResults.message': 'Try adjusting your search criteria or filters',
      'jobSeekers.noResults.clearFilters': 'Clear All Filters',
      'jobSeekers.actions.viewProfile': 'View Profile',
      
      // Contact Us Section
      'contact.title': 'Contact Us',
      'contact.subtitle': 'Get in touch with us. We\'d love to hear from you.',
      'contact.form.name': 'Full Name',
      'contact.form.email': 'Email Address',
      'contact.form.subject': 'Subject',
      'contact.form.message': 'Message',
      'contact.form.submit': 'Send Message',
      'contact.form.sending': 'Sending...',
      'contact.form.success': 'Message sent successfully!',
      'contact.form.success.title': 'Message Sent Successfully!',
      'contact.form.success.message': 'Thank you for contacting us. We\'ll get back to you soon.',
      'contact.form.placeholder.name': 'Enter your full name',
      'contact.form.placeholder.email': 'Enter your email address',
      'contact.form.placeholder.subject': 'Enter subject',
      'contact.form.placeholder.message': 'Enter your message',
      'contact.info.email.title': 'Email',
      'contact.info.email.details': 'info@jobportal.rw',
      'contact.info.email.desc': 'Send us an email anytime',
      'contact.info.phone.title': 'Phone',
      'contact.info.phone.details': '+250 788 123 456',
      'contact.info.phone.desc': 'Mon-Fri from 8am to 6pm',
      'contact.info.office.title': 'Office',
      'contact.info.office.details': 'Kigali, Rwanda',
      'contact.info.office.desc': 'Visit our office',
      
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
      'footer.legal': 'Legal',
      'footer.cookies': 'Cookie Policy',
      'footer.backToTop': 'Back to Top',
    }
  },
  rw: {
    translation: {
      // Navigation
      'nav.home': 'Ahabanza',
      'nav.about': 'Ibyo',
      'nav.jobSeekers': 'Abashaka Akazi',
      'nav.contact': 'Twandikire',
      'nav.register': 'Kwiyandikisha',
      'nav.login': 'Kwinjira',
      'nav.language': 'Ururimi',
      'nav.viewJobSeekers': 'Reba Abashaka Akazi',
      
      // Hero Section
      'hero.title': 'Huzuza Ubumenyi n\'Urupfu',
      'hero.subtitle': 'Urupapuro rw\'ibanze ruhuzuza abashaka akazi bafite ubumenyi n\'abakozi ba nyuma mu Rwanda',
      'hero.cta.primary': 'Tangira',
      'hero.cta.secondary': 'Reba Abantu',
      'hero.tour': 'Urupapuro rw\'Ibyangombwa n\'Urupfu',
      
      // Features Section
      'features.title': 'Kuberiki Twihitamo Urupapuro Rwacu',
      'features.subtitle': 'Dushoboza abashaka akazi n\'abakozi dushya',
      'features.jobSeekers.title': 'Ku Bashaka Akazi',
      'features.jobSeekers.desc': 'Kora profile yawe ya professional kandi uhuzwe n\'abakozi ba nyuma',
      'features.employers.title': 'Ku Bakozi',
      'features.employers.desc': 'Shakira abantu bafite ubumenyi kandi ufate ibikorwa byawe by\'uburezi',
      'features.privacy.title': 'Ibyangombwa By\'ibanze',
      'features.privacy.desc': 'Amakuru yawe ari mu kurenganwa n\'uburenganzira bw\'ibanze',
      
      // About Us Section
      'about.title': 'Ibyo',
      'about.subtitle': 'Duhuzuza ubumenyi n\'urupfu mu Rwanda yose dukoresheje ikoranabuhanga rishya n\'ubufasha bw\'ibanze.',
      'about.mission.title': 'Intego Yacu',
      'about.mission.desc': 'Guhuzuza icyuho hagati y\'abantu b\'umwuga bafite ubumenyi n\'abakozi ba nyuma mu Rwanda, dukora ubufatanye bw\'ingenzi bushobora gutuma umutungo w\'igihugu ukura kandi umuntu yuzuza ibyo ashaka. Tizera ko buri muntu agomba kugira amahirwe yo gushakana akazi ke k\'ubwishime.',
      'about.vision.title': 'Icyerekezo Cyacu',
      'about.vision.desc': 'Kuba urupapuro rw\'ibanze rw\'uburezi n\'uburezi mu Rwanda, dushoboza abantu n\'amasosiyete kugera ku bushobozi bwabo bwose dukoresheje ikoranabuhanga rishya n\'ubufasha bw\'ibanze.',
      'about.stats.jobSeekers': 'Abashaka Akazi',
      'about.stats.companies': 'Amasosiyete',
      'about.stats.successRate': 'Igihe Cy\'Intsinzi',
      'about.stats.experience': 'Imyaka y\'Uburambe',
      'about.values.passion.title': 'Urukundo ku Bantu',
      'about.values.passion.desc': 'Tizera mu bushobozi bw\'ubumenyi bw\'umuntu kandi dushyigikira gufasha abantu kuzuza intego zabo z\'umwuga.',
      'about.values.trust.title': 'Kwizera n\'Umutekano',
      'about.values.trust.desc': 'Ibyangombwa byawe n\'umutekano w\'amakuru ari ibintu by\'ibanze. Dukomeza uburenganzira bw\'ibanze.',
      'about.values.excellence.title': 'Ubwiza',
      'about.values.excellence.desc': 'Dushishikariza ubwiza mu byose dukora, kuva ku gushyiraho urupapuro kugeza ku serivisi z\'abakiriya.',
      'about.values.community.title': 'Umuryango',
      'about.values.community.desc': 'Gukora umuryango utagatifu w\'abantu b\'umwuga n\'abakozi mu Rwanda yose.',
      
      // Latest Job Seekers Section
      'jobSeekers.title': 'Abashaka Akazi ba Vuba',
      'jobSeekers.subtitle': 'Shakira abantu bafite ubumenyi bateguye gutanga ku ntsinzi y\'ishyirwa ryawe',
      'jobSeekers.viewMore': 'Reba Birenzeho',
      'jobSeekers.experience': 'imyaka',
      'jobSeekers.location': 'Kigali, Rwanda',
      
      // Job Seekers Page
      'jobSeekers.pageTitle': 'Abashaka Akazi ba Vuba',
      'jobSeekers.pageSubtitle': 'Shakira abantu bafite ubumenyi bateguye gutanga ku ntsinzi y\'ishyirwa ryawe',
      'jobSeekers.searchPlaceholder': 'Shakira abantu bafite ubumenyi bateguye gutanga ku ntsinzi y\'ishyirwa ryawe',
      'jobSeekers.filters.location': 'Ubumenyi',
      'jobSeekers.filters.allLocations': 'Ubumenyi wose',
      'jobSeekers.filters.experience': 'Uburambe',
      'jobSeekers.filters.allExperience': 'Uburambe wose',
      'jobSeekers.filters.sortBy': 'Shakira',
      'jobSeekers.filters.mostRecent': 'Ibyo by\'uburambe',
      'jobSeekers.filters.highestRated': 'Ibyo by\'uburambe',
      'jobSeekers.filters.mostExperienced': 'Ibyo by\'uburambe',
      'jobSeekers.filters.name': 'Amazina A-Z',
      'jobSeekers.filters.skills': 'Ibyo',
      'jobSeekers.results': 'ibyiza',
      'jobSeekers.noResults.title': 'Abashaka Akazi bateguye gutanga ku ntsinzi y\'ishyirwa ryawe',
      'jobSeekers.noResults.message': 'Dushaka kugira ngo dushyirwa ku ntsinzi y\'ishyirwa ryawe',
      'jobSeekers.noResults.clearFilters': 'Iryo ry\'ibyiza',
      'jobSeekers.actions.viewProfile': 'Reba Profile',
      
      // Contact Us Section
      'contact.title': 'Twandikire',
      'contact.subtitle': 'Twandikire. Dushaka kumva kuri wewe.',
      'contact.form.name': 'Amazina Yose',
      'contact.form.email': 'Imeyili',
      'contact.form.subject': 'Icyo',
      'contact.form.message': 'Ubutumwa',
      'contact.form.submit': 'Ohereza Ubutumwa',
      'contact.form.sending': 'Ohereza...',
      'contact.form.success': 'Ubutumwa bwoherejwe neza!',
      'contact.form.success.title': 'Ubutumwa bwoherejwe neza!',
      'contact.form.success.message': 'Twandikire. Dushaka kumva kuri wewe.',
      'contact.form.placeholder.name': 'Andika amazina yawe yose',
      'contact.form.placeholder.email': 'Andika imeyili yawe',
      'contact.form.placeholder.subject': 'Andika icyo',
      'contact.form.placeholder.message': 'Andika ubutumwa bwawe',
      'contact.info.email.title': 'Ineyili',
      'contact.info.email.details': 'info@jobportal.rw',
      'contact.info.email.desc': 'Ohereza imeyili igihe icyo aricyo',
      'contact.info.phone.title': 'Telefoni',
      'contact.info.phone.details': '+250 788 123 456',
      'contact.info.phone.desc': 'Ku wa Mbere-Ku wa Gatanu 8:00-18:00',
      'contact.info.office.title': 'Biro',
      'contact.info.office.details': 'Kigali, Rwanda',
      'contact.info.office.desc': 'Uza kuri biro byacu',
      
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
      'footer.legal': 'Amategeko',
      'footer.cookies': 'Politiki y\'Amakuki',
      'footer.backToTop': 'Subira Hejuru',
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