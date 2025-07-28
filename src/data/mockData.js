// Centralized Mock Data for Job Portal Application

// Job Seekers Data - Lower-Skilled Workers Only
export const jobSeekersData = [
  // Domestic Worker - Housemaid
  {
    id: 1,
    name: "Francine Mukamana",
    title: "Housemaid",
    category: "domestic",
    subcategory: "Housemaid",
    location: "Kigali, Rwanda",
    experience: 5,
    skills: ["House Cleaning", "Laundry", "Cooking", "Childcare", "Ironing"],
    avatar: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=150&h=150&fit=crop&crop=face",
    rating: 4.9,
    reviews: 15,
    dailyRate: 5000,
    monthlyRate: 120000,
    availability: "Available",
    languages: ["Kinyarwanda", "French"],
    education: "Primary School",
    certifications: [],
    contact: {
      email: "francine.mukamana@email.com",
      phone: "+250 789 234 567",
      linkedin: null
    },
    bio: "Experienced housemaid with 5 years of experience in household management. Skilled in cleaning, cooking, and childcare. Reliable and trustworthy.",
    projects: [],
    references: [
      { name: "Mrs. Uwimana", phone: "+250 788 111 111", relationship: "Previous Employer" },
      { name: "Mr. Ndayisaba", phone: "+250 788 222 222", relationship: "Previous Employer" }
    ]
  },
  
  // Babysitter
  {
    id: 2,
    name: "Marie Claire Uwineza",
    title: "Babysitter",
    category: "care",
    subcategory: "Babysitter",
    location: "Kigali, Rwanda",
    experience: 3,
    skills: ["Childcare", "First Aid", "Educational Activities", "Meal Preparation", "Safety"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    reviews: 12,
    dailyRate: 4000,
    monthlyRate: 100000,
    availability: "Available",
    languages: ["Kinyarwanda", "English"],
    education: "Secondary School",
    certifications: ["First Aid Certificate"],
    contact: {
      email: "marie.uwineza@email.com",
      phone: "+250 787 345 678",
      linkedin: null
    },
    bio: "Caring and patient babysitter with 3 years of experience. Specialized in caring for children aged 1-10 years. Can help with homework and educational activities.",
    projects: [],
    references: [
      { name: "Mrs. Mukamana", phone: "+250 788 333 333", relationship: "Previous Employer" }
    ]
  },
  
  // Gardener
  {
    id: 3,
    name: "Emmanuel Niyonshuti",
    title: "Gardener",
    category: "maintenance",
    subcategory: "Gardener",
    location: "Kigali, Rwanda",
    experience: 8,
    skills: ["Landscaping", "Plant Care", "Irrigation", "Tree Trimming", "Garden Design"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4.6,
    reviews: 18,
    dailyRate: 6000,
    monthlyRate: 150000,
    availability: "Available",
    languages: ["Kinyarwanda", "French"],
    education: "Primary School",
    certifications: [],
    contact: {
      email: "emmanuel.niyonshuti@email.com",
      phone: "+250 786 456 789",
      linkedin: null
    },
    bio: "Experienced gardener with 8 years of experience in landscaping and plant care. Skilled in garden design and maintenance. Owns gardening tools.",
    projects: [],
    references: [
      { name: "Mr. Uwimana", phone: "+250 788 444 444", relationship: "Previous Employer" }
    ]
  },
  
  // Cook
  {
    id: 4,
    name: "Grace Mukamana",
    title: "Cook",
    category: "food",
    subcategory: "Cook",
    location: "Kigali, Rwanda",
    experience: 6,
    skills: ["Rwandan Cuisine", "International Cuisine", "Meal Planning", "Kitchen Management", "Food Safety"],
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    reviews: 20,
    dailyRate: 7000,
    monthlyRate: 180000,
    availability: "Available",
    languages: ["Kinyarwanda", "English", "French"],
    education: "Secondary School",
    certifications: ["Food Safety Certificate"],
    contact: {
      email: "grace.mukamana@email.com",
      phone: "+250 785 567 890",
      linkedin: null
    },
    bio: "Experienced cook specializing in Rwandan and international cuisine. Can prepare meals for families and events. Knowledgeable about dietary restrictions.",
    projects: [],
    references: [
      { name: "Mrs. Ndayisaba", phone: "+250 788 555 555", relationship: "Previous Employer" }
    ]
  },
  
  // Driver
  {
    id: 5,
    name: "David Nkurunziza",
    title: "Driver",
    category: "transport",
    subcategory: "Driver",
    location: "Kigali, Rwanda",
    experience: 10,
    skills: ["Safe Driving", "Vehicle Maintenance", "Route Planning", "Customer Service", "GPS Navigation"],
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    reviews: 25,
    dailyRate: 8000,
    monthlyRate: 200000,
    availability: "Available",
    languages: ["Kinyarwanda", "English", "French"],
    education: "Secondary School",
    certifications: ["Driver's License", "Defensive Driving"],
    contact: {
      email: "david.nkurunziza@email.com",
      phone: "+250 784 678 901",
      linkedin: null
    },
    bio: "Professional driver with 10 years of experience. Clean driving record. Can drive various vehicle types. Punctual and reliable.",
    projects: [],
    references: [
      { name: "Mr. Mukamana", phone: "+250 788 666 666", relationship: "Previous Employer" }
    ]
  },
  
  // Security Guard
  {
    id: 6,
    name: "Jean Pierre Ndayisaba",
    title: "Security Guard",
    category: "maintenance",
    subcategory: "Security Guard",
    location: "Kigali, Rwanda",
    experience: 4,
    skills: ["Security Monitoring", "Access Control", "Emergency Response", "Patrol", "Customer Service"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.5,
    reviews: 16,
    dailyRate: 5000,
    monthlyRate: 120000,
    availability: "Available",
    languages: ["Kinyarwanda", "English"],
    education: "Secondary School",
    certifications: ["Security License"],
    contact: {
      email: "jean.ndayisaba@email.com",
      phone: "+250 789 234 567",
      linkedin: null
    },
    bio: "Dedicated security guard with 4 years of experience. Trained in emergency response and access control. Reliable and alert.",
    projects: [],
    references: [
      { name: "Mr. Uwineza", phone: "+250 788 777 777", relationship: "Previous Employer" }
    ]
  },
  
  // Cleaner
  {
    id: 7,
    name: "Ange Uwimana",
    title: "Cleaner",
    category: "domestic",
    subcategory: "Cleaner",
    location: "Kigali, Rwanda",
    experience: 3,
    skills: ["Deep Cleaning", "Window Cleaning", "Floor Care", "Sanitization", "Equipment Operation"],
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 4.6,
    reviews: 14,
    dailyRate: 4000,
    monthlyRate: 100000,
    availability: "Available",
    languages: ["Kinyarwanda", "French"],
    education: "Primary School",
    certifications: [],
    contact: {
      email: "ange.uwimana@email.com",
      phone: "+250 788 888 888",
      linkedin: null
    },
    bio: "Professional cleaner with 3 years of experience. Skilled in deep cleaning and sanitization. Owns cleaning equipment and supplies.",
    projects: [],
    references: [
      { name: "Mrs. Nkurunziza", phone: "+250 788 999 999", relationship: "Previous Employer" }
    ]
  },
  
  // Waiter
  {
    id: 8,
    name: "Claudine Uwamahoro",
    title: "Waiter",
    category: "food",
    subcategory: "Waiter/Waitress",
    location: "Kigali, Rwanda",
    experience: 2,
    skills: ["Customer Service", "Food Service", "Table Setting", "Order Taking", "Cash Handling"],
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 4.4,
    reviews: 10,
    dailyRate: 3000,
    monthlyRate: 80000,
    availability: "Available",
    languages: ["Kinyarwanda", "English"],
    education: "Secondary School",
    certifications: [],
    contact: {
      email: "claudine.uwamahoro@email.com",
      phone: "+250 788 000 000",
      linkedin: null
    },
    bio: "Friendly and efficient waiter with 2 years of experience in restaurants and cafes. Good at customer service and handling busy periods.",
    projects: [],
    references: [
      { name: "Mr. Restaurant Owner", phone: "+250 788 111 000", relationship: "Previous Employer" }
    ]
  },
  
  // Market Vendor
  {
    id: 9,
    name: "Beatrice Nyirahabimana",
    title: "Market Vendor",
    category: "sales",
    subcategory: "Market Vendor",
    location: "Kigali, Rwanda",
    experience: 7,
    skills: ["Sales", "Customer Service", "Inventory Management", "Negotiation", "Cash Handling"],
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4.8,
    reviews: 22,
    dailyRate: 4000,
    monthlyRate: 100000,
    availability: "Available",
    languages: ["Kinyarwanda", "French"],
    education: "Primary School",
    certifications: [],
    contact: {
      email: "beatrice.nyirahabimana@email.com",
      phone: "+250 788 222 000",
      linkedin: null
    },
    bio: "Experienced market vendor with 7 years of experience selling vegetables and fruits. Known for fair prices and quality products.",
    projects: [],
    references: [
      { name: "Market Manager", phone: "+250 788 333 000", relationship: "Market Supervisor" }
    ]
  },
  
  // Handyman
  {
    id: 10,
    name: "Pierre Nzabonimana",
    title: "Handyman",
    category: "maintenance",
    subcategory: "Handyman",
    location: "Kigali, Rwanda",
    experience: 6,
    skills: ["Basic Repairs", "Plumbing", "Electrical", "Carpentry", "Painting"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 4.7,
    reviews: 19,
    dailyRate: 6000,
    monthlyRate: 150000,
    availability: "Available",
    languages: ["Kinyarwanda", "French"],
    education: "Secondary School",
    certifications: [],
    contact: {
      email: "pierre.nzabonimana@email.com",
      phone: "+250 788 444 000",
      linkedin: null
    },
    bio: "Skilled handyman with 6 years of experience in home repairs and maintenance. Can handle various household repairs and improvements.",
    projects: [],
    references: [
      { name: "Mrs. Homeowner", phone: "+250 788 555 000", relationship: "Previous Client" }
    ]
  }
];

// Job Categories for Lower-Skilled Workers Only
export const jobCategories = [
  // Domestic & Household Services
  {
    id: 'domestic',
    name: 'Domestic & Household',
    icon: 'Home',
    subcategories: [
      'Housemaid',
      'Housekeeper',
      'Cleaner',
      'Laundry Worker',
      'Ironing Service',
      'House Manager'
    ]
  },
  // Childcare & Elderly Care
  {
    id: 'care',
    name: 'Care Services',
    icon: 'Heart',
    subcategories: [
      'Babysitter',
      'Nanny',
      'Elderly Care',
      'Special Needs Care',
      'Pet Sitter',
      'Daycare Worker'
    ]
  },
  // Food & Hospitality
  {
    id: 'food',
    name: 'Food & Hospitality',
    icon: 'Utensils',
    subcategories: [
      'Cook',
      'Chef',
      'Kitchen Helper',
      'Waiter/Waitress',
      'Bartender',
      'Food Delivery'
    ]
  },
  // Maintenance & Services
  {
    id: 'maintenance',
    name: 'Maintenance & Services',
    icon: 'Wrench',
    subcategories: [
      'Gardener',
      'Driver',
      'Security Guard',
      'Handyman',
      'Electrician',
      'Plumber',
      'Painter',
      'Carpenter'
    ]
  },
  // Sales & Retail
  {
    id: 'sales',
    name: 'Sales & Retail',
    icon: 'ShoppingCart',
    subcategories: [
      'Sales Representative',
      'Cashier',
      'Store Clerk',
      'Customer Service',
      'Telemarketer',
      'Market Vendor'
    ]
  },
  // Transportation
  {
    id: 'transport',
    name: 'Transportation',
    icon: 'Truck',
    subcategories: [
      'Taxi Driver',
      'Bus Driver',
      'Delivery Driver',
      'Motorcycle Taxi',
      'Truck Driver',
      'Chauffeur'
    ]
  }
];

// Features Data - Focused on Lower-Skilled Workers
export const featuresData = [
  {
    id: 1,
    icon: "Users",
    title: "Smart Matching",
    description: "Find reliable domestic workers, caregivers, and service providers for your home and business needs",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    id: 2,
    icon: "Shield",
    title: "Verified Workers",
    description: "All workers are verified with background checks and reference validation for your safety",
    borderColor: "border-green-200",
    bgColor: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    id: 3,
    icon: "Clock",
    title: "Quick Hiring",
    description: "Connect with qualified workers within hours, not days",
    borderColor: "border-purple-200",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    id: 4,
    icon: "Globe",
    title: "Local & Reliable",
    description: "Access trusted local workers from your community and surrounding areas",
    borderColor: "border-orange-200",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    id: 5,
    icon: "Heart",
    title: "Trust & Safety",
    description: "Safe and secure platform with built-in protection for both employers and workers",
    borderColor: "border-red-200",
    bgColor: "bg-red-50",
    iconColor: "text-red-600"
  },
  {
    id: 6,
    icon: "MessageCircle",
    title: "Direct Communication",
    description: "Connect directly with workers through our secure messaging system",
    borderColor: "border-indigo-200",
    bgColor: "bg-indigo-50",
    iconColor: "text-indigo-600"
  }
];

// Statistics Data for Lower-Skilled Workers
export const statsData = [
  {
    id: 1,
    number: "5,000+",
    label: "Verified Workers",
    icon: "Users"
  },
  {
    id: 2,
    number: "2,000+",
    label: "Happy Families",
    icon: "Home"
  },
  {
    id: 3,
    number: "98%",
    label: "Satisfaction Rate",
    icon: "Heart"
  },
  {
    id: 4,
    number: "24/7",
    label: "Support",
    icon: "Headphones"
  }
];

// Values Data for Lower-Skilled Workers
export const valuesData = [
  {
    id: 1,
    title: "Community",
    description: "Supporting local workers and families in our community",
    icon: "Users"
  },
  {
    id: 2,
    title: "Trust",
    description: "Building lasting relationships through transparency and reliability",
    icon: "Heart"
  },
  {
    id: 3,
    title: "Quality",
    description: "Ensuring high-quality service from verified and experienced workers",
    icon: "Star"
  },
  {
    id: 4,
    title: "Safety",
    description: "Providing safe and secure connections between families and workers",
    icon: "Shield"
  }
];

// Contact Information
export const contactInfo = [
  {
    id: 1,
    title: "Email",
    value: "info@jobportal.rw",
    description: "Send us an email anytime",
    icon: "Mail"
  },
  {
    id: 2,
    title: "Phone",
    value: "+250 788 123 456",
    description: "Mon-Fri from 8am to 6pm",
    icon: "Phone"
  },
  {
    id: 3,
    title: "Office",
    value: "Kigali, Rwanda",
    description: "Visit our office",
    icon: "MapPin"
  }
];

// Footer Links Data
export const footerLinksData = [
  {
    id: 1,
    title: "Company",
    links: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#careers" },
      { name: "Press", href: "#press" },
      { name: "Blog", href: "#blog" }
    ]
  },
  {
    id: 2,
    title: "Services",
    links: [
      { name: "For Employers", href: "#employers" },
      { name: "For Job Seekers", href: "#job-seekers" },
      { name: "Pricing", href: "#pricing" },
      { name: "Resources", href: "#resources" }
    ]
  },
  {
    id: 3,
    title: "Support",
    links: [
      { name: "Help Center", href: "#help" },
      { name: "Contact Us", href: "#contact" },
      { name: "FAQ", href: "#faq" },
      { name: "Community", href: "#community" }
    ]
  },
  {
    id: 4,
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Cookie Policy", href: "#cookies" },
      { name: "GDPR", href: "#gdpr" }
    ]
  }
];

// Navigation Data
export const navigationData = [
  { key: 'nav.home', href: '/', isExternal: false },
  { key: 'nav.jobSeekers', href: '/job-seekers', isExternal: false },
  { key: 'nav.contact', href: '#contact', isExternal: true },
  { key: 'nav.about', href: '#about', isExternal: true }
];

// Filter Options Data
export const filterOptions = {
  locations: [
    "All Locations",
    "Kigali, Rwanda",
    "Huye, Rwanda", 
    "Musanze, Rwanda",
    "Rubavu, Rwanda",
    "Remote"
  ],
  categories: [
    "All Categories",
    "Domestic",
    "Care",
    "Food",
    "Maintenance",
    "Sales",
    "Transportation"
  ],
  experience: [
    "All Experience",
    "0-1 years",
    "1-3 years", 
    "3-5 years",
    "5-10 years",
    "10+ years"
  ],
  dailyRateRange: [
    "All Rates",
    "Under 3,000 RWF/day",
    "3,000 - 5,000 RWF/day",
    "5,000 - 7,000 RWF/day",
    "7,000 - 10,000 RWF/day",
    "Over 10,000 RWF/day"
  ],
  monthlyRateRange: [
    "All Monthly Rates",
    "Under 80,000 RWF/month",
    "80,000 - 120,000 RWF/month",
    "120,000 - 180,000 RWF/month",
    "180,000 - 250,000 RWF/month",
    "Over 250,000 RWF/month"
  ],
  availability: [
    "All Availability",
    "Available",
    "Full Time",
    "Part Time",
    "Flexible",
    "Weekends Only",
    "Evenings Only"
  ],
  education: [
    "All Education",
    "No Formal Education",
    "Primary School",
    "Secondary School",
    "Vocational Training",
    "Bachelor's Degree"
  ],
  sortBy: [
    "Most Recent",
    "Highest Rated",
    "Most Experienced",
    "Name A-Z",
    "Lowest Rate",
    "Highest Rate"
  ]
};

// Skills Data for Lower-Skilled Workers
export const skillsData = [
  // Domestic Skills
  "House Cleaning", "Laundry", "Ironing", "Cooking", "Meal Preparation", "Kitchen Management",
  "Childcare", "Elderly Care", "Pet Care", "First Aid", "Safety", "Educational Activities",
  
  // Maintenance Skills
  "Gardening", "Landscaping", "Plant Care", "Basic Repairs", "Plumbing", "Electrical",
  "Carpentry", "Painting", "Security Monitoring", "Access Control", "Patrol",
  
  // Transportation Skills
  "Safe Driving", "Vehicle Maintenance", "Route Planning", "Customer Service", "GPS Navigation",
  "Defensive Driving", "Passenger Safety",
  
  // Hospitality Skills
  "Food Service", "Table Setting", "Order Taking", "Cash Handling", "Customer Service",
  "Bartending", "Food Delivery",
  
  // Sales Skills
  "Sales", "Customer Service", "Inventory Management", "Negotiation", "Cash Handling",
  "Product Knowledge", "Market Knowledge",
  
  // Language Skills
  "Kinyarwanda", "English", "French", "Swahili", "Basic Communication", "Translation"
];

// Skill Level Categories for Lower-Skilled Workers
export const skillLevels = [
  {
    id: 'entry',
    name: 'Entry Level',
    description: 'New to the field, basic skills',
    dailyRateRange: { min: 3000, max: 5000 },
    monthlyRateRange: { min: 80000, max: 120000 },
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    description: 'Some experience, reliable skills',
    dailyRateRange: { min: 4000, max: 7000 },
    monthlyRateRange: { min: 100000, max: 180000 },
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'experienced',
    name: 'Experienced',
    description: 'Proven track record, advanced skills',
    dailyRateRange: { min: 6000, max: 10000 },
    monthlyRateRange: { min: 150000, max: 250000 },
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
];

// Education Levels
export const educationLevels = [
  { id: 'none', name: 'No Formal Education', description: 'Learned through experience' },
  { id: 'primary', name: 'Primary School', description: 'Basic education completed' },
  { id: 'secondary', name: 'Secondary School', description: 'High school education' },
  { id: 'vocational', name: 'Vocational Training', description: 'Trade or skill training' },
  { id: 'bachelor', name: 'Bachelor\'s Degree', description: 'University degree' },
  { id: 'master', name: 'Master\'s Degree', description: 'Advanced university degree' },
  { id: 'phd', name: 'PhD/Doctorate', description: 'Highest academic degree' }
];

// Availability Options
export const availabilityOptions = [
  { id: 'fulltime', name: 'Full Time', description: 'Available for full-time work' },
  { id: 'parttime', name: 'Part Time', description: 'Available for part-time work' },
  { id: 'flexible', name: 'Flexible', description: 'Flexible schedule available' },
  { id: 'weekends', name: 'Weekends Only', description: 'Available on weekends' },
  { id: 'evenings', name: 'Evenings Only', description: 'Available in evenings' },
  { id: 'oncall', name: 'On Call', description: 'Available when needed' }
];

// Language Proficiency Levels
export const languageLevels = [
  { id: 'basic', name: 'Basic', description: 'Can understand and speak basic phrases' },
  { id: 'conversational', name: 'Conversational', description: 'Can hold basic conversations' },
  { id: 'fluent', name: 'Fluent', description: 'Can speak and understand well' },
  { id: 'native', name: 'Native', description: 'Native speaker level' }
]; 