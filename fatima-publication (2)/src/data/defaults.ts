import {
  Book,
  Quote,
  TeamMember,
  TimelineEvent,
  PublishingPackage,
  Testimonial,
  PublishingPartner,
  AppSettings,
  GalleryItem,
  UserProfile
} from '../types';

export const DEFAULT_PARTNERS: PublishingPartner[] = [
  { id: '1', name: 'Amazon', logoUrl: 'https://images.unsplash.com/photo-1523474253046-2cd2c788f304?auto=format&fit=crop&q=80&w=200', partnerUrl: 'https://www.amazon.com' },
  { id: '2', name: 'Kindle', logoUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200', partnerUrl: 'https://kdp.amazon.com' },
  { id: '3', name: 'Google Play Books', logoUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=200', partnerUrl: 'https://play.google.com/store/books' },
  { id: '4', name: 'Flipkart', logoUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=200', partnerUrl: 'https://www.flipkart.com' },
  { id: '5', name: 'Kobo', logoUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200', partnerUrl: 'https://www.kobo.com' }
];

export const DEFAULT_SETTINGS: AppSettings = {
  contactAddress: 'Fatima House, 12/A Literary Lane, Writers Block, New Delhi, India',
  contactEmail: 'contact@fatimapublication.com',
  contactPhone: '+91 98871 XXXXX',
  aboutStory: 'Founded in 2018, Fatima Publication emerged from a simple observation: some of the most profound voices in modern literature often remain unheard. We set out to build a publishing bridge that combines the quality standards of traditional publishinghouses with the custom care, agility, and global digital distribution expected by modern authors. Over the years, we have brought over 150 authors to market, spanning multiple languages and genres.',
  aboutMission: 'To empower visionaries and storytellers across the globe with access to editing, visual craft, publication, and distribution without bounds.',
  aboutVision: 'To become a preeminent globally accessible platform that transforms raw ideas into literary and cultural landmarks.',
  aboutValues: [
    'Editorial Rigour: Beautiful writing is crafted with tireless care.',
    'Author Agency: Authors are co-creators of their visual identity.',
    'Global Ingress: Reaching readers wherever books are read online or offline.',
    'Inclusive Narratives: Storytelling across cultural boundaries.'
  ],
  siteName: 'Fatima Publication',
  siteIconUrl: '',
  visibleNavPages: ['home', 'bookstore', 'about', 'join', 'publish', 'manuscript', 'gallery'],
  certTitle: 'Legal Incorporative Proof',
  certDescription: 'Fatima Publication holds a valid certification issued under Ministry of Commerce and Information Broadcasting Reg No. IN-DL7329581A-FATIMA.',
  certCardHeader: 'Registration Certificate',
  certCardSubHeader: 'Govt. of India Legal Cognizance',
  certCardName: 'Fatima Publication',
  certCardCode: 'FAT-DL7329581A',
  certCardStatus: 'Active Partner',
  navLabelHome: 'Home',
  navLabelBookstore: 'Bookstore',
  navLabelAbout: 'About',
  navLabelGallery: 'Gallery',
  navLabelJoin: 'Join',
  navLabelPublish: 'Publish',
  navLabelManuscript: 'Submit'
};

export const DEFAULT_USERS: UserProfile[] = [
  { id: 'u-1', email: 'mohd.fahad98871@gmail.com', displayName: 'Mohd Fahad', role: 'admin', createdAt: new Date().toISOString() },
  { id: 'u-2', email: 'editor.fatima@example.com', displayName: 'Editor Fatima', role: 'admin', createdAt: new Date().toISOString() },
  { id: 'u-3', email: 'reader1@example.com', displayName: 'Jane Reader', role: 'public', createdAt: new Date().toISOString() }
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'g-1',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
    title: 'The Editorial Workspace',
    description: 'Where manuscripts are meticulously reviewed and copy-edited to perfection by our senior literati team.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'g-2',
    imageUrl: 'https://images.unsplash.com/photo-1474932430478-367db2683bfc?auto=format&fit=crop&q=80&w=800',
    title: 'Classic Typewriters Collection',
    description: 'Our classic typewriter repository celebrating the heritage of draftsmanship, typography and layout symmetry.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'g-3',
    imageUrl: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&q=80&w=800',
    title: 'Dynamic Archives & Bookstore',
    description: 'Showcasing the physical stacks and backlogs of our beautiful publications distributed worldwide.',
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Aisha Rahman',
    relation: "Author of 'The Whispering Minarets'",
    text: 'Fatima Publication walked with me from editorial review to my Kindle launch. Their visual design team crafted a cover that was exactly what I dreamed of.',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 't-2',
    name: 'Vikram Sethi',
    relation: "Author of 'Quantum Sagas'",
    text: 'Global distribution is a difficult maze, but Fatima Publication simplified Amazon, Kobo and Google Play Books distribution seamlessly. Exceptional author guidance!',
    rating: 5,
    createdAt: new Date().toISOString()
  },
  {
    id: 't-3',
    name: 'Sarah Jenkins',
    relation: "Author of 'Untethered Memories'",
    text: 'The Premium package provided editing, formatting, and ISBN registration that was incredibly fast and professional. Highly recommended!',
    rating: 5,
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_PACKAGES: PublishingPackage[] = [
  {
    id: 'pkg-1',
    name: 'Starter Package',
    description: 'Perfect for first-time authors looking to get their ebook out to the world.',
    features: [
      'Basic copy-editing check',
      'Electronic ISBN registration',
      'ePub & Mobi eBook formatting',
      'Standard Cover Design',
      'Distribution on Amazon Kindle, Google Play Books, & Kobo',
      'Author Console access (marketing dashboard)'
    ],
    price: '$299 / ₹24,999',
    createdAt: new Date().toISOString()
  },
  {
    id: 'pkg-2',
    name: 'Professional Package',
    description: 'Our most popular package. Brings your book to print and global paperback shelves.',
    features: [
      'Comprehensive editorial review & proofreading',
      'ISBN allocation (Printed + Digital)',
      'Paperback formatting & custom interior layout',
      'Premium Custom Cover Illustration & Design',
      'Distribution on Amazon, Flipkart, & local bookstore channels',
      'Print-on-Demand setup with 10 free author paperback copies',
      'Press Release Draft & Book Release social assets'
    ],
    price: '$599 / ₹49,999',
    createdAt: new Date().toISOString()
  },
  {
    id: 'pkg-3',
    name: 'Premium Package',
    description: 'An elite tier providing comprehensive end-to-end publishing, design agency care, and dynamic promotions.',
    features: [
      'Detailed substantive editing',
      'Unrestricted ISBN setup across all formats',
      'Premium Hardcover and Paperback interior layouts',
      'Dedicated lead graphic designer for cover and internal layouts',
      'Global distribution: physical + digital libraries + audiobook pre-checks',
      '30 free author copies (hardcover + paperback mixed)',
      'Social media campaign management & author website setup',
      'Featured home page position on Fatima Publication for 3 months'
    ],
    price: '$1,199 / ₹99,999',
    createdAt: new Date().toISOString()
  },
  {
    id: 'pkg-4',
    name: 'Custom Package',
    description: 'Tailored specifically for unique projects, academic archives, illustrated novels, or corporate legacy anthologies.',
    features: [
      'Custom bespoke volume selections',
      'Translate services if needed',
      'Illustrator commissions managed directly',
      'Custom PR launch events and marketing rollouts',
      'Direct dialogue with executive board members'
    ],
    price: 'Bespoke Pricing',
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_TIMELINE: TimelineEvent[] = [
  {
    id: 'time-1',
    year: '2018',
    title: 'An Idea Takes Flight',
    description: 'Fatima Publication was founded in a small study with a mission to help indie writers access top-tier editorial services and distribution channels.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'time-2',
    year: '2020',
    title: 'Crossing Boundaries',
    description: 'Achieved a milestone of publishing 50 diverse titles and forged distribution alliances with Kindle Direct Publishing (KDP) and Google Play Books.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'time-3',
    year: '2022',
    title: 'Print On Demand and Logistics Integration',
    description: 'Launched the Premium Print-on-Demand system, enabling authors to distribute gorgeous paperbacks on Flipkart and international Amazon hubs without hefty upfront print runs.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'time-4',
    year: '2025',
    title: 'Fatima Community Portal',
    description: 'Built our writer community hubs, holding monthly workshops, author feedback reviews, and global digital networking.',
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Fatima Al-Hassan',
    designation: 'Founder & Chief Editor',
    biography: 'With over 15 years in traditional publishing, Fatima envisioned a transparent, author-centric home for modern storytellers.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    createdAt: new Date().toISOString()
  },
  {
    id: 'team-2',
    name: 'Rajesh Nair',
    designation: 'Director of Layout & Production',
    biography: 'Rajesh is obsessive about elegant kerning, clean paperbacks, and optimized ePub formatting of complicated scripts.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    createdAt: new Date().toISOString()
  },
  {
    id: 'team-3',
    name: 'Chloe Tremblay',
    designation: 'Lead Graphic & Cover Designer',
    biography: 'Chloe brings book sleeves to life, mixing modern visual metaphors with classical display fonts to arrest reader eyes immediately.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_QUOTES: Quote[] = [
  { id: 'q-1', text: '“A room without books is like a body without a soul.”', author: 'Marcus Tullius Cicero', createdAt: new Date().toISOString() },
  { id: 'q-2', text: '“Books are a uniquely portable magic.”', author: 'Stephen King', createdAt: new Date().toISOString() },
  { id: 'q-3', text: '“There is no friend as loyal as a book.”', author: 'Ernest Hemingway', createdAt: new Date().toISOString() },
  { id: 'q-4', text: '“Writers don’t write from what they know; they write from what they wonder about.”', author: 'Fatima Al-Hassan', createdAt: new Date().toISOString() }
];

export const DEFAULT_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: 'The Whispering Minarets',
    author: 'Aisha Rahman',
    genre: 'Fiction',
    language: 'English',
    price: '$12.99 / ₹399',
    description: 'A historical mystery sweeping from old corridors of Delhi to digital alleys of Paris, unraveling of an ancient blueprint hidden in Plain sight.',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isFeatured: true,
    purchaseLinks: {
      amazon: 'https://amazon.com',
      kindle: 'https://amazon.com',
      googlePlay: 'https://play.google.com'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'book-2',
    title: 'Quantum Sagas',
    author: 'Vikram Sethi',
    genre: 'Science Fiction',
    language: 'English',
    price: '$14.99 / ₹499',
    description: 'A futuristic thriller that explores what happens when human consciousness is transcribed into atomic states. Highly technical and beautifully written.',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isFeatured: true,
    purchaseLinks: {
      amazon: 'https://amazon.com',
      flipkart: 'https://flipkart.com',
      kobo: 'https://kobo.com'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'book-3',
    title: 'The Shaded Orchid',
    author: 'Priya Sharma',
    genre: 'Romance',
    language: 'Hindi',
    price: '$9.99 / ₹299',
    description: 'Set in pristine Himalayan estates, this modern translation tells an intricate tale of longing, duty, and organic healing.',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isFeatured: true,
    purchaseLinks: {
      amazon: 'https://amazon.com',
      kindle: 'https://amazon.com'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'book-4',
    title: 'Beneath the Banyan Tree',
    author: 'Prof. Harish Sen',
    genre: 'Biography',
    language: 'English',
    price: '$19.99 / ₹599',
    description: 'An insightful retrospective biography tracing the evolution of rural schooling infrastructures in colonial India.',
    coverUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isFeatured: false,
    purchaseLinks: {
      amazon: 'https://amazon.com',
      googlePlay: 'https://play.google.com'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'book-5',
    title: 'Echoes of the Thar',
    author: 'Meera Singh',
    genre: 'Poetry',
    language: 'Hindi',
    price: '$7.99 / ₹199',
    description: 'An evocative anthology of poems channeling the dry wind, colorful clothes, and historical folk songs of Rajathan.',
    coverUrl: 'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isFeatured: false,
    purchaseLinks: {
      amazon: 'https://amazon.com',
      flipkart: 'https://flipkart.com'
    },
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_HERO_SLIDES = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1600',
    title: 'Transform Your Manuscript Into a Masterpiece',
    subtitle: 'From copy editing to global distribution, Fatima Publication walks with authors to turn writing dreams into pristine paperbacks.',
    primaryCta: 'Explore Books',
    primaryAction: 'bookstore',
    secondaryCta: 'Publish Your Book',
    secondaryAction: 'publish'
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1600',
    title: 'Global Print on Demand & Digital Reach',
    subtitle: 'Distribute your hardcovers and eBooks across Amazon Kindle, Google Play Books, Flipkart, and Kobo with absolute ease.',
    primaryCta: 'Submit Manuscript',
    primaryAction: 'manuscript',
    secondaryCta: 'Explore Books',
    secondaryAction: 'bookstore'
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1600',
    title: 'An Inspired Community of Professional Authors',
    subtitle: 'Join networking panels, writing clinics, and creative meetups to push your craft to its complete potential.',
    primaryCta: 'Join Community',
    primaryAction: 'join',
    secondaryCta: 'Publish Package Rates',
    secondaryAction: 'publish'
  }
];
