export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  language: string;
  price: string;
  description: string;
  coverUrl: string;
  isAvailable: boolean;
  isFeatured: boolean;
  purchaseLinks: {
    amazon?: string;
    kindle?: string;
    googlePlay?: string;
    flipkart?: string;
    kobo?: string;
  };
  buyNowLink?: string;
  createdAt: string;
}

export interface Quote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  biography: string;
  imageUrl: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  occupation?: string;
  interests?: string;
  createdAt: string;
}

export interface Manuscript {
  id: string;
  authorName: string;
  email: string;
  phone: string;
  city: string;
  title: string;
  genre: string;
  wordCount: number;
  synopsis: string;
  manuscriptUrl: string; // Document URL (Firebase storage or fallback base64/name)
  coverLetterUrl?: string;
  status: 'received' | 'review' | 'feedback' | 'contract';
  internalNotes?: string;
  createdAt: string;
}

export interface PublishingPackage {
  id: string;
  name: string;
  description: string;
  features: string[]; // Array of strings represent bullet items
  price: string;
  createdAt: string;
}

export interface PackageInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookTitle?: string;
  selectedPackage: string; // package ID or name
  additionalRequirements?: string;
  status: 'new' | 'contacted' | 'consultation' | 'converted';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  relation: string; // e.g. "Author of 'The Silent Quill'"
  text: string;
  rating: number; // 1-5 stars
  createdAt: string;
}

export interface PublishingPartner {
  id: string;
  name: string;
  logoUrl: string;
  partnerUrl: string;
}

export interface AppSettings {
  contactAddress: string;
  contactEmail: string;
  contactPhone: string;
  aboutStory: string;
  aboutMission: string;
  aboutVision: string;
  aboutValues: string[];
  siteName?: string;
  siteIconUrl?: string;
  visibleNavPages?: string[];
  certTitle?: string;
  certDescription?: string;
  certCardHeader?: string;
  certCardSubHeader?: string;
  certCardName?: string;
  certCardCode?: string;
  certCardStatus?: string;
  navLabelHome?: string;
  navLabelBookstore?: string;
  navLabelAbout?: string;
  navLabelGallery?: string;
  navLabelJoin?: string;
  navLabelPublish?: string;
  navLabelManuscript?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'public';
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  primaryAction: string;
  secondaryCta: string;
  secondaryAction: string;
}
