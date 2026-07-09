export type ProductType =
  | 'Checklist'
  | 'Guide'
  | 'Worksheet'
  | 'Template'
  | 'Planner'
  | 'Calculator'
  | 'SOP'
  | 'Course'
  | 'Business Kit'
  | 'Digital Download'
  | 'Resource'
  | 'Web Page'
  | 'Landing Page'
  | 'Knowledge Base'
  | 'Form'
  | 'Document';

export interface AIAnalysis {
  category: string;
  targetAudience: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  industry: string;
  productFormat: string;
  businessGoal: string;
  customerPainPoints: string[];
  desiredOutcome: string;
  sellingOpportunities: string[];
}

export interface ProductStructure {
  name: string;
  shortDescription: string;
  longDescription: string;
  summary: string;
  features: string[];
  benefits: string[];
  learningOutcomes: string[];
  estimatedCompletionTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  industry: string;
  language: string;
  productType: ProductType;
  version: string;
  author: string;
  tags: string[];
  keywords: string[];
  categories: string[];
}

// Discriminator for nested content depending on product type
export interface ProductContent {
  checklist?: {
    tasks: Array<{
      id: string;
      title: string;
      description: string;
      subtasks: string[];
      tips: string[];
      whyItMatters: string;
      bestPractices: string[];
      warnings: string[];
      notes: string;
      isCompleted?: boolean;
    }>;
  };
  guide?: {
    sections: Array<{
      id: string;
      title: string;
      content: string;
      examples: string[];
      resources: string[];
      tips: string[];
    }>;
  };
  course?: {
    modules: Array<{
      id: string;
      title: string;
      description: string;
      lessons: Array<{
        id: string;
        title: string;
        content: string;
        exercise: string;
        quiz: {
          question: string;
          options: string[];
          correctAnswer: string;
        };
      }>;
    }>;
  };
  planner?: {
    daily: {
      schedule: Array<{ time: string; task: string }>;
      priorities: string[];
      habits: string[];
    };
    weekly: {
      goals: string[];
      focusDays: Array<{ day: string; theme: string }>;
      notes: string;
    };
    monthly: {
      milestones: string[];
      trackers: Array<{ name: string; target: string }>;
    };
  };
  calculator?: {
    inputs: Array<{ label: string; key: string; defaultValue: number; type: 'number' | 'percent' | 'currency' }>;
    formula: string; // JavaScript evaluation mathematical string or description
    calculationOutputs: Array<{ label: string; formulaKey: string; prefix?: string; suffix?: string }>;
    tips: string[];
  };
  document?: {
    title: string;
    sections: Array<{ heading: string; body: string }>;
    conclusion: string;
  };
}

export interface VisualAssets {
  cover: {
    bgGradientStart: string;
    bgGradientEnd: string;
    textColor: string;
    accentColor: string;
    iconName: string;
    layoutType: 'minimal' | 'bold' | 'editorial' | 'split';
  };
  thumbnail: {
    imageUrl: string;
    bgStyle: string;
  };
  productIcon: string;
  socialMediaBanner: {
    title: string;
    subtitle: string;
    ctaText: string;
    layout: string;
  };
  websiteBanner: {
    headline: string;
    subheadline: string;
    badge: string;
  };
  featureGraphics: string[];
  mockups: Array<{
    type: 'laptop' | 'mobile' | 'book' | 'card';
    label: string;
  }>;
}

export interface MarketingContent {
  salesDescription: string;
  shortPitch: string;
  longSalesCopy: string;
  callToAction: string;
  metaDescription: string;
  seoKeywords: string[];
  productHighlights: string[];
  faq: Array<{ question: string; answer: string }>;
  emailCampaign: Array<{ subject: string; body: string; day: number }>;
  socialMediaCaptions: Array<{ platform: 'Twitter/X' | 'LinkedIn' | 'Instagram'; text: string }>;
  productLaunchContent: string;
}

export interface MarketplaceListing {
  bgrowthStore: { title: string; price: number; listingBody: string; tags: string[] };
  etsy: { title: string; price: number; description: string; materials: string[] };
  gumroad: { title: string; price: number; description: string; buttonText: string };
  payhip: { title: string; price: number; description: string; fileLabel: string };
  shopify: { title: string; price: number; bodyHtml: string; vendor: string };
  amazonKDP?: { title: string; subtitle: string; description: string; categories: string[] };
}

export interface SEOMetadata {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
  };
  twitterCard: {
    card: string;
    title: string;
    description: string;
  };
  imageAltText: string;
  structuredKeywords: string[];
  internalSearchKeywords: string[];
}

export interface ProductVersion {
  version: string;
  timestamp: string;
  updatedBy: string;
  changeLog: string;
  state: {
    structure: ProductStructure;
    content: ProductContent;
    assets: VisualAssets;
    marketing: MarketingContent;
    marketplace: MarketplaceListing;
    seo: SEOMetadata;
  };
}

export interface AnalyticsData {
  views: number;
  downloads: number;
  sales: number;
  conversionRate: number; // e.g., 2.4 %
  revenue: number;
  aiCreditsUsed: number;
  publishingHistory: Array<{ date: string; action: string; platform: string }>;
  trafficSources: Array<{ source: string; percentage: number }>;
}

export interface DigitalProduct {
  id: string;
  status: 'Draft' | 'Published' | 'Archived' | 'Template';
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
  prompt: string;
  creditsCost: number;

  analysis: AIAnalysis;
  structure: ProductStructure;
  content: ProductContent;
  assets: VisualAssets;
  marketing: MarketingContent;
  marketplace: MarketplaceListing;
  seo: SEOMetadata;
  analytics: AnalyticsData;
  versions: ProductVersion[];
}

export interface AICreditCost {
  action: string;
  cost: number;
}
