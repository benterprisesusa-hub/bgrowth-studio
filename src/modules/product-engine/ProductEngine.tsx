import { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  Zap, 
  BookOpen, 
  Calculator, 
  Layers, 
  FileSpreadsheet, 
  Sparkles,
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Eye, 
  Copy, 
  Archive, 
  Globe, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight, 
  Upload, 
  FileCode, 
  Share2, 
  Grid, 
  Trash2,
  Tag,
  Clock,
  Briefcase,
  Layers3,
  BadgeAlert,
  ArrowRight,
  ShieldCheck,
  Check,
  Menu,
  X
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

// =========================================================================
// TS TYPES & INTERFACES
// =========================================================================

export interface BGrowthProduct {
  id: string;
  name: string;
  slug: string;
  type: 'Workspace' | 'Planner' | 'Calculator' | 'Template' | 'Course' | 'Bundle' | 'Membership';
  status: 'Draft' | 'Published' | 'Archived';
  price: number;
  currency: string;
  version: string;
  lastUpdated: string;
  thumbnail: string;
  // General Tab
  shortDescription: string;
  commercialDescription: string;
  category: string;
  industry: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  estimatedTime: string;
  // Content Source Tab
  contentSource: {
    builderType: 'Checklist Builder' | 'Planner Engine' | 'Calculator Engine' | 'Worksheet Engine' | 'Universal Builder' | 'Interactive Generator';
    builderName: string;
    builderVersion: string;
    builderId: string;
    moduleSummary: string;
    sectionsCount: number;
    itemsCount: number;
  };
  // Media Tab
  media: {
    heroImage: string;
    gallery: string[];
    previewImages: string[];
    videoUrl?: string;
    downloads: { name: string; size: string; type: string }[];
  };
  // Commerce Tab
  commerce: {
    paymentProfile: string;
    visibility: 'Public' | 'Private' | 'Unlisted';
    distribution: 'Redirect Link' | 'Embed Code' | 'Interactive Applet';
    taxCategory: string;
  };
  // SEO Tab
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
}

type SidebarTab = 'dashboard' | 'product-engine' | 'assets' | 'settings';

// =========================================================================
// INITIAL PREPOPULATED DATA
// =========================================================================

const INITIAL_PRODUCTS: BGrowthProduct[] = [
  {
    id: "prod-notary-1",
    name: "Independent Notary Solopreneur Scaler",
    slug: "notary-solopreneur-scaler",
    type: "Workspace",
    status: "Published",
    price: 49.00,
    currency: "USD",
    version: "1.2.0",
    lastUpdated: "2026-07-10",
    thumbnail: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    shortDescription: "Complete step-by-step interactive workflow, client triage guides, and physical compliance standard for independent mobile notary publics.",
    commercialDescription: "Transform your raw notary operations into a highly-efficient machine. This interactive BGrowth product covers the entire customer journey, from initial call triage to physical presence protocols, seal registration, and automated review campaigns.\n\nDesigned by top legal administrative consultants to eliminate travel liabilities and maximize Google reviews.",
    category: "Legal Operations",
    industry: "Professional Services",
    tags: ["Notary", "SOP", "Compliance", "Mobile Business"],
    difficulty: "Intermediate",
    estimatedTime: "2-3 weeks integration",
    contentSource: {
      builderType: "Interactive Generator",
      builderName: "BGrowth SOP Converter v2",
      builderVersion: "2.4.1",
      builderId: "builder-sop-notary-99",
      moduleSummary: "3 Operations Sections, 18 Dynamic Checklist steps, 12 compliance fields",
      sectionsCount: 3,
      itemsCount: 18
    },
    media: {
      heroImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1000&auto=format&fit=crop&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60"
      ],
      previewImages: [
        "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500"
      ],
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      downloads: [
        { name: "Notary_Client_Intake_SOP.pdf", size: "1.4 MB", type: "PDF Guide" },
        { name: "Mileage_Faturamento_Model.xlsx", size: "420 KB", type: "Spreadsheet" }
      ]
    },
    commerce: {
      paymentProfile: "Gumroad One-time Checkout",
      visibility: "Public",
      distribution: "Interactive Applet",
      taxCategory: "Digital Goods"
    },
    seo: {
      title: "Scale Your Mobile Notary Business to $5k+/Month | BGrowth",
      description: "Get the exact operational workflow, physical checklists, and triage standards used by top-grossing mobile notaries in the BGrowth Club.",
      keywords: "mobile notary checklist, notary guide, cartório móvel, BGrowth",
      ogImage: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200"
    }
  },
  {
    id: "prod-planner-1",
    name: "Startup Venture Financial Architect",
    slug: "startup-venture-financial-architect",
    type: "Planner",
    status: "Published",
    price: 79.00,
    currency: "USD",
    version: "2.1.4",
    lastUpdated: "2026-07-13",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    shortDescription: "A structured business and financial architecture planner mapping out cap tables, milestone projections, and funding preparation lists.",
    commercialDescription: "Stop guessing your milestones. The Startup Venture Financial Architect is an immersive digital planner that walks founders step-by-step through setting up their legal structures, computing cap table dilutive rounds, and assembling investor data rooms.\n\nDesigned for early-stage companies targeting Pre-Seed and Seed capital rounds.",
    category: "Corporate Finance",
    industry: "Tech Startups",
    tags: ["Cap Table", "Funding", "Immersive Planner", "Pitch Deck"],
    difficulty: "Expert",
    estimatedTime: "45-60 Days roadmap",
    contentSource: {
      builderType: "Planner Engine",
      builderName: "Corporate Venture Builder",
      builderVersion: "1.10.0",
      builderId: "builder-vc-planner-01",
      moduleSummary: "5 Financial phases, 25 high-priority milestones, 10 data templates",
      sectionsCount: 5,
      itemsCount: 25
    },
    media: {
      heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60"
      ],
      previewImages: [],
      downloads: [
        { name: "VC_Ready_Cap_Table_Standard.xlsx", size: "2.1 MB", type: "Template" }
      ]
    },
    commerce: {
      paymentProfile: "Stripe Subscription Standard",
      visibility: "Public",
      distribution: "Interactive Applet",
      taxCategory: "SaaS Service"
    },
    seo: {
      title: "Startup Financial Venture Planner & Dilution Model | BGrowth",
      description: "Construct an institutional-grade investment strategy and clear cap table milestones with BGrowth's premium business planner.",
      keywords: "startup financial planner, vc template, seed funding guide",
      ogImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200"
    }
  },
  {
    id: "prod-calc-1",
    name: "SaaS Pricing & LTV ROI Engine",
    slug: "saas-pricing-ltv-roi-engine",
    type: "Calculator",
    status: "Draft",
    price: 29.00,
    currency: "USD",
    version: "1.0.1",
    lastUpdated: "2026-07-14",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    shortDescription: "Interactive pricing, churn weight, and Customer Lifetime Value return on investment calculator for SaaS business models.",
    commercialDescription: "Optimize your software pricing structure based on real financial simulation. Input your CAC, average churn rate, expansion revenue goals, and get instant pricing matrix scenarios complete with break-even points and payback models.",
    category: "Pricing Strategy",
    industry: "Software & SaaS",
    tags: ["Calculator", "CAC", "LTV", "ROI", "SaaS Finance"],
    difficulty: "Intermediate",
    estimatedTime: "Instant simulation",
    contentSource: {
      builderType: "Calculator Engine",
      builderName: "Value Engine Lab",
      builderVersion: "3.1.0",
      builderId: "builder-calc-saas-101",
      moduleSummary: "3 Calculator steps, 14 variable variables, 5 chart views",
      sectionsCount: 3,
      itemsCount: 14
    },
    media: {
      heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&auto=format&fit=crop&q=80",
      gallery: [],
      previewImages: [],
      downloads: []
    },
    commerce: {
      paymentProfile: "Gumroad One-time Checkout",
      visibility: "Unlisted",
      distribution: "Interactive Applet",
      taxCategory: "SaaS Service"
    },
    seo: {
      title: "Interactive SaaS Churn & Pricing ROI Calculator | BGrowth",
      description: "Fine-tune subscription profitability with our dynamic Lifetime Value simulation models.",
      keywords: "saas calculator, ltv cac ratio simulator, pricing grid",
      ogImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200"
    }
  },
  {
    id: "prod-swot-1",
    name: "Corporate SWOT Strategy Matrix",
    slug: "corporate-swot-strategy-matrix",
    type: "Workspace",
    status: "Published",
    price: 99.00,
    currency: "USD",
    version: "1.1.0",
    lastUpdated: "2026-07-12",
    thumbnail: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    shortDescription: "Deep corporate assessment workspace featuring automated SWOT cross-matching, risk scoring, and interactive board report generation.",
    commercialDescription: "The absolute standard for corporate strategic retreats. Facilitators can input internal organizational strengths, cross-map threat matrices, assign severity weights, and generate presentation-ready board room strategic executive drafts instantly.",
    category: "Enterprise Strategy",
    industry: "Management Consulting",
    tags: ["SWOT Analysis", "Risk Assessment", "Corporate Strategy"],
    difficulty: "Expert",
    estimatedTime: "3-5 Days workshop",
    contentSource: {
      builderType: "Worksheet Engine",
      builderName: "SWOT Boardroom Generator",
      builderVersion: "1.0.2",
      builderId: "builder-swot-work-15",
      moduleSummary: "4 Strategic blocks, 20 SWOT vector items, 1 auto-report",
      sectionsCount: 4,
      itemsCount: 20
    },
    media: {
      heroImage: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=1000&auto=format&fit=crop&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=60"
      ],
      previewImages: [],
      downloads: [
        { name: "Executive_SWOT_Framework.pdf", size: "3.2 MB", type: "PDF Slide Deck" }
      ]
    },
    commerce: {
      paymentProfile: "Enterprise custom billing",
      visibility: "Public",
      distribution: "Interactive Applet",
      taxCategory: "Digital Goods"
    },
    seo: {
      title: "Corporate SWOT Analysis Workspace & PDF Generator | BGrowth",
      description: "Upgrade your strategic retreat assessments with our real-time boardroom SWOT mapping framework.",
      keywords: "corporate swot template, threat matrix planner, strategic audit",
      ogImage: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=1200"
    }
  },
  {
    id: "prod-mkt-1",
    name: "Growth Agency Retention Playbook",
    slug: "growth-agency-retention-playbook",
    type: "Template",
    status: "Archived",
    price: 149.00,
    currency: "USD",
    version: "3.0.0",
    lastUpdated: "2026-06-25",
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    shortDescription: "Ultimate agency operations workspace mapping out onboarding, weekly feedback loops, and campaign diagnostic checklists.",
    commercialDescription: "Run your client communication on absolute rails. Under v3 of this playbook, agencies have decreased logo-churn by over 45% through strict micro-milestone tracking and streamlined creative feedback channels built into this engine.",
    category: "Marketing Operations",
    industry: "Creative & Growth Agencies",
    tags: ["Onboarding", "Agency SOP", "Account Management"],
    difficulty: "Intermediate",
    estimatedTime: "1 Week implementation",
    contentSource: {
      builderType: "Universal Builder",
      builderName: "Universal Master Architect",
      builderVersion: "5.0.0",
      builderId: "builder-uni-agency-77",
      moduleSummary: "6 Modules, 32 Onboarding steps, 4 legal signoffs",
      sectionsCount: 6,
      itemsCount: 32
    },
    media: {
      heroImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&auto=format&fit=crop&q=80",
      gallery: [],
      previewImages: [],
      downloads: []
    },
    commerce: {
      paymentProfile: "Stripe Subscription Standard",
      visibility: "Private",
      distribution: "Interactive Applet",
      taxCategory: "Digital Goods"
    },
    seo: {
      title: "Growth Agency Client Retention & SOP Workspace | BGrowth",
      description: "Deploy the exact client onboarding and creative governance system that retains seven-figure retainer clients.",
      keywords: "agency onboarding workflow, growth client sop, retain clients",
      ogImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200"
    }
  }
];

// =========================================================================
// ANALYTICS DATA
// =========================================================================

const RECENT_IMPORTS = [
  { date: 'Jul 08', checklists: 2, planners: 3, calculators: 1, total: 6 },
  { date: 'Jul 09', checklists: 4, planners: 1, calculators: 2, total: 7 },
  { date: 'Jul 10', checklists: 5, planners: 4, calculators: 1, total: 10 },
  { date: 'Jul 11', checklists: 3, planners: 2, calculators: 3, total: 8 },
  { date: 'Jul 12', checklists: 6, planners: 5, calculators: 2, total: 13 },
  { date: 'Jul 13', checklists: 8, planners: 3, calculators: 4, total: 15 },
  { date: 'Jul 14', checklists: 12, planners: 6, calculators: 5, total: 23 },
];

const BUILDER_BREAKDOWN = [
  { name: 'Checklist Builder', value: 42, color: '#1061EC' },
  { name: 'Planner Engine', value: 28, color: '#0EA5A0' },
  { name: 'Calculator Engine', value: 15, color: '#F59E0B' },
  { name: 'Worksheet Engine', value: 10, color: '#10B981' },
  { name: 'Universal Builder', value: 5, color: '#7C3AED' },
];

const INTEGRATIONS_LOG = [
  { id: "log-1", builder: "Checklist Builder", template: "Mobile Notary SOP", status: "Imported Successfully", time: "2026-07-14 09:42" },
  { id: "log-2", builder: "Interactive Generator", template: "SWOT Boardroom Retros", status: "Imported Successfully", time: "2026-07-14 08:15" },
  { id: "log-3", builder: "Planner Engine", template: "E-Commerce Launch Tracker", status: "Validation Pending", time: "2026-07-14 07:11" },
  { id: "log-4", builder: "Calculator Engine", template: "Roof Pricing Formula v2", status: "Imported Successfully", time: "2026-07-13 18:30" },
];

const AVAILABLE_BUILDERS = [
  { id: 'checklist', name: 'Checklist Builder', description: 'Interactive checklists with professional tips, validation rules, and PDFs.', icon: Database, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  { id: 'planner', name: 'Planner Engine', description: 'Phase-based milestone roadmaps, schedule tools, and multi-user tracking.', icon: Layers, color: 'text-teal-600 bg-teal-50 border-teal-100' },
  { id: 'calculator', name: 'Calculator Engine', description: 'Financial formulas, CAC/LTV pricing matrices, and dynamic charts.', icon: Calculator, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  { id: 'worksheet', name: 'Worksheet Engine™', description: 'SWOT analyses, strategy quadrants, and corporate workshops.', icon: FileSpreadsheet, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { id: 'universal', name: 'Universal Builder Engine™', description: 'Combined dynamic profiles, multi-module frameworks, and guides.', icon: Layers3, color: 'text-purple-600 bg-purple-50 border-purple-100' },
  { id: 'generator', name: 'Interactive Product Generator™', description: 'SOP file/PDF text analyzer mapping steps to compliance code.', icon: Zap, color: 'text-pink-600 bg-pink-50 border-pink-100' },
];

// =========================================================================
// EXPORTS & MAIN COMPONENT
// =========================================================================

export function ProductEngine({ 
  ownerEmail,
  onHome,
  onSelectTool,
  language,
  onLanguageChange
}: { 
  ownerEmail: string;
  onHome?: () => void;
  onSelectTool?: (tool: string) => void;
  language: 'pt' | 'en';
  onLanguageChange: (lang: 'pt' | 'en') => void;
}) {
  // Navigation State
  const [activeTab, setActiveTab] = useState<SidebarTab>('product-engine');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  
  // Product Library state
  const [products, setProducts] = useState<BGrowthProduct[]>(() => {
    const saved = localStorage.getItem('bgrowth_engine_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Published' | 'Archived'>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  // Selected Active Product
  const [selectedProductId, setSelectedProductId] = useState<string>(() => {
    const saved = localStorage.getItem('bgrowth_engine_products');
    const prods = saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    return prods[0]?.id || "prod-notary-1";
  });

  const activeProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Right Panel Tabs
  const [detailsTab, setDetailsTab] = useState<'General' | 'Content Source' | 'Media' | 'Commerce' | 'SEO' | 'Publishing'>('General');

  // Live Website Product Page Preview Toggle
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Form Fields holding state for actively selected product
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formCommDesc, setFormCommDesc] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formIndustry, setFormIndustry] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');
  const [formTime, setFormTime] = useState('');

  // Commerce State
  const [formPrice, setFormPrice] = useState(0);
  const [formPaymentProfile, setFormPaymentProfile] = useState('');
  const [formVisibility, setFormVisibility] = useState<'Public' | 'Private' | 'Unlisted'>('Public');
  const [formDistribution, setFormDistribution] = useState<'Redirect Link' | 'Embed Code' | 'Interactive Applet'>('Interactive Applet');
  const [formTaxCategory, setFormTaxCategory] = useState('');

  // Media State
  const [formHeroImage, setFormHeroImage] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');

  // SEO State
  const [formSeoTitle, setFormSeoTitle] = useState('');
  const [formSeoDesc, setFormSeoDesc] = useState('');
  const [formSeoKeywords, setFormSeoKeywords] = useState('');

  // Sync Form States when active product changes
  useEffect(() => {
    if (activeProduct) {
      setFormName(activeProduct.name);
      setFormSlug(activeProduct.slug);
      setFormShortDesc(activeProduct.shortDescription);
      setFormCommDesc(activeProduct.commercialDescription);
      setFormCategory(activeProduct.category);
      setFormIndustry(activeProduct.industry);
      setFormTags(activeProduct.tags.join(', '));
      setFormDifficulty(activeProduct.difficulty);
      setFormTime(activeProduct.estimatedTime);

      setFormPrice(activeProduct.price);
      setFormPaymentProfile(activeProduct.commerce?.paymentProfile || 'Gumroad One-time Checkout');
      setFormVisibility(activeProduct.commerce?.visibility || 'Public');
      setFormDistribution(activeProduct.commerce?.distribution || 'Interactive Applet');
      setFormTaxCategory(activeProduct.commerce?.taxCategory || 'Digital Goods');

      setFormHeroImage(activeProduct.media?.heroImage || '');
      setFormThumbnail(activeProduct.thumbnail || '');

      setFormSeoTitle(activeProduct.seo?.title || '');
      setFormSeoDesc(activeProduct.seo?.description || '');
      setFormSeoKeywords(activeProduct.seo?.keywords || '');
    }
  }, [activeProduct]);

  // Toast Alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Persist Products List to LocalStorage
  const saveProductsToStorage = (updatedList: BGrowthProduct[]) => {
    setProducts(updatedList);
    localStorage.setItem('bgrowth_engine_products', JSON.stringify(updatedList));
  };

  // SAVE PRODUCT CHANGES
  const handleSaveProductDetails = () => {
    if (!activeProduct) return;

    const updated = products.map(p => {
      if (p.id === activeProduct.id) {
        return {
          ...p,
          name: formName,
          slug: formSlug,
          shortDescription: formShortDesc,
          commercialDescription: formCommDesc,
          category: formCategory,
          industry: formIndustry,
          tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
          difficulty: formDifficulty,
          estimatedTime: formTime,
          price: Number(formPrice),
          thumbnail: formThumbnail,
          commerce: {
            ...p.commerce,
            paymentProfile: formPaymentProfile,
            visibility: formVisibility,
            distribution: formDistribution,
            taxCategory: formTaxCategory,
          },
          media: {
            ...p.media,
            heroImage: formHeroImage,
          },
          seo: {
            ...p.seo,
            title: formSeoTitle,
            description: formSeoDesc,
            keywords: formSeoKeywords,
          },
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    });

    saveProductsToStorage(updated);
    triggerToast(`✓ Product details saved successfully!`);
  };

  // DUPLICATE PRODUCT
  const handleDuplicateProduct = () => {
    if (!activeProduct) return;
    const copy: BGrowthProduct = {
      ...activeProduct,
      id: `prod-copy-${Date.now()}`,
      name: `${activeProduct.name} (Copy)`,
      slug: `${activeProduct.slug}-copy`,
      status: "Draft",
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    const updated = [copy, ...products];
    saveProductsToStorage(updated);
    setSelectedProductId(copy.id);
    triggerToast(`✓ Product duplicated successfully!`);
  };

  // CHANGE STATUS (Draft, Publish, Archive)
  const handleUpdateStatus = (newStatus: 'Draft' | 'Published' | 'Archived') => {
    if (!activeProduct) return;
    const updated = products.map(p => {
      if (p.id === activeProduct.id) {
        return { ...p, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] };
      }
      return p;
    });
    saveProductsToStorage(updated);
    triggerToast(`✓ Status updated to ${newStatus}`);
  };

  // IMPORT RAW CONTENT DIALOG
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importSelectedBuilder, setImportSelectedBuilder] = useState('Checklist Builder');
  const [importName, setImportName] = useState('');
  const [importPrice, setImportPrice] = useState('49.00');

  const handleImportContent = () => {
    if (!importName.trim()) {
      alert("Please provide a product title.");
      return;
    }

    const newProd: BGrowthProduct = {
      id: `prod-${Date.now()}`,
      name: importName,
      slug: importName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      type: importSelectedBuilder === 'Planner Engine' ? 'Planner' : importSelectedBuilder === 'Calculator Engine' ? 'Calculator' : 'Workspace',
      status: "Draft",
      price: Number(importPrice) || 0.0,
      currency: "USD",
      version: "1.0.0",
      lastUpdated: new Date().toISOString().split('T')[0],
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&auto=format&fit=crop&q=60",
      shortDescription: "Imported product blueprint waiting for commercial configuration.",
      commercialDescription: "This product content was generated or built within BGrowth Studio. Configure high-fidelity assets, media kits, Stripe payment visibility, and publish to index on the BGrowth ecosystem.",
      category: "Operations",
      industry: "General Business",
      tags: ["Imported", "Draft"],
      difficulty: "Intermediate",
      estimatedTime: "2 Weeks",
      contentSource: {
        builderType: importSelectedBuilder as any,
        builderName: `${importSelectedBuilder} Master v2`,
        builderVersion: "2.1.0",
        builderId: `builder-${Math.floor(Math.random() * 9000 + 1000)}`,
        moduleSummary: "Default Imported Content structure - ready for publishing pipeline",
        sectionsCount: 4,
        itemsCount: 22
      },
      media: {
        heroImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&auto=format&fit=crop&q=80",
        gallery: [],
        previewImages: [],
        downloads: []
      },
      commerce: {
        paymentProfile: "Gumroad One-time Checkout",
        visibility: "Public",
        distribution: "Interactive Applet",
        taxCategory: "Digital Goods"
      },
      seo: {
        title: `${importName} | BGrowth Studio`,
        description: `Imported compliance workflow and checklists for ${importName}.`,
        keywords: "bgrowth, checklist, template",
        ogImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200"
      }
    };

    saveProductsToStorage([newProd, ...products]);
    setSelectedProductId(newProd.id);
    setIsImportModalOpen(false);
    setImportName('');
    triggerToast(`✓ Imported content successfully!`);
  };

  // DELETE PRODUCT
  const handleDeleteProduct = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const filtered = products.filter(p => p.id !== id);
    saveProductsToStorage(filtered);
    if (selectedProductId === id && filtered.length > 0) {
      setSelectedProductId(filtered[0].id);
    }
    triggerToast("✓ Product deleted from Product Engine");
  };

  // Filtered Products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' ? true : p.status === statusFilter;
      const matchesType = typeFilter === 'All' ? true : p.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [products, searchQuery, statusFilter, typeFilter]);

  // Validation Check List Metrics for Publishing Tab
  const validationChecklist = useMemo(() => {
    if (!activeProduct) return [];
    return [
      { id: 'v1', text: 'Commercial Descriptions populated', status: (formShortDesc.length > 10 && formCommDesc.length > 20) },
      { id: 'v2', text: 'Valid pricing and Stripe/Gumroad payment gateway defined', status: (formPrice > 0 && !!formPaymentProfile) },
      { id: 'v3', text: 'Media high-res assets & hero graphics connected', status: (!!formHeroImage && !!formThumbnail) },
      { id: 'v4', text: 'Builder content source link established & synchronized', status: !!activeProduct.contentSource?.builderId },
      { id: 'v5', text: 'OpenGraph tags and search engine keywords populated', status: (formSeoTitle.length > 10 && formSeoDesc.length > 15) },
    ];
  }, [activeProduct, formShortDesc, formCommDesc, formPrice, formPaymentProfile, formHeroImage, formThumbnail, formSeoTitle, formSeoDesc]);

  const validationScore = validationChecklist.filter(item => item.status).length;
  const isPublishReady = validationScore === validationChecklist.length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)} 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}
      
      {/* ===================================================================
          LEFT NAVIGATION SIDEBAR (Dashboard, Builders, Product Engine...)
          =================================================================== */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800 bg-slate-900 text-slate-300 flex flex-col shrink-0 transition-transform duration-300 lg:static lg:translate-x-0 ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-3 text-left w-full">
          <button
            type="button"
            onClick={() => {
              if (onHome) onHome();
              setIsMobileSidebarOpen(false);
            }}
            className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity cursor-pointer group"
            title="Return to BGrowth Studio Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md group-hover:scale-105 transition-transform">
              <Database className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wider text-white uppercase leading-none">Product Engine</h2>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-black block mt-1">BGrowth Factory</span>
            </div>
          </button>

          {/* Close Sidebar button for mobile */}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none"
            title="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { id: 'dashboard', label: language === 'pt' ? 'Painel de Controle' : 'Dashboard', icon: TrendingUp, desc: language === 'pt' ? 'Performance & Métricas' : 'Performance & Imports' },
            { id: 'product-engine', label: language === 'pt' ? 'Motor de Produtos' : 'Product Engine', icon: Database, desc: language === 'pt' ? 'Produtos Comerciais' : 'Commercial Products' },
            { id: 'assets', label: language === 'pt' ? 'Mídia & Assets' : 'Assets & Media', icon: Upload, desc: language === 'pt' ? 'Galeria de Arquivos' : 'Central Asset Lab' },
            { id: 'settings', label: language === 'pt' ? 'Configurações' : 'Settings', icon: Settings, desc: language === 'pt' ? 'Endpoints e Chaves' : 'Endpoints & API Keys' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id as SidebarTab);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full group flex items-center gap-3.5 px-4 py-3 rounded-xl text-left text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`} />
                <div className="flex-1 min-w-0">
                  <span className="block leading-none">{item.label}</span>
                  <span className={`block text-[10px] mt-0.5 font-medium leading-none ${isActive ? 'text-blue-200' : 'text-slate-600'}`}>{item.desc}</span>
                </div>
                {item.id === 'product-engine' && (
                  <span className={`ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'}`}>
                    {products.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Workspace Administrator</p>
          <p className="text-xs text-slate-400 font-bold truncate mt-0.5">{ownerEmail}</p>
        </div>
      </aside>

      {/* ===================================================================
          MAIN CONTENT AREA
          =================================================================== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
        
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu Open button */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none shrink-0"
              title="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="min-w-0">
              <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase block truncate">
                {language === 'pt' ? 'Administração BGrowth Studio' : 'BGrowth Studio Administration'}
              </span>
              <h1 className="text-sm sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
                {activeTab === 'dashboard' && (language === 'pt' ? "Painel de Performance & Atividade" : "Performance & Activity Dashboard")}
                {activeTab === 'product-engine' && (language === 'pt' ? "Motor Principal de Produtos" : "Master Product Engine")}
                {activeTab === 'assets' && (language === 'pt' ? "Biblioteca Global de Ativos e Mídia" : "Assets & Global Media Library")}
                {activeTab === 'settings' && (language === 'pt' ? "Configurações de Infraestrutura" : "Engine Infrastructure Settings")}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Inline Language Selector inside Product Engine */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 mr-1 sm:mr-2 shrink-0">
              <button
                type="button"
                onClick={() => onLanguageChange('pt')}
                className={`px-1.5 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                  language === 'pt'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`px-1.5 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 px-3 sm:px-4 py-2 text-xs font-bold text-white shadow-sm transition-transform active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === 'pt' ? 'Importar Conteúdo' : 'Import Builder Content'}
              </span>
              <span className="inline sm:hidden">
                {language === 'pt' ? 'Importar' : 'Import'}
              </span>
            </button>
          </div>
        </header>

        {/* Dynamic Inner Tab Views */}
        <div className="flex-1 overflow-hidden relative">

          {/* ===============================================================
              VIEW 1: DASHBOARD ANALYTICS & RECENT ACTIVITY
              =============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="h-full overflow-y-auto p-6 space-y-6">
              
              {/* Top Row Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  { 
                    label: language === 'pt' ? "Produtos Ativos Publicados" : "Active Published Products", 
                    val: products.filter(p => p.status === 'Published').length, 
                    total: language === 'pt' ? `Total ${products.length} registrados` : `Total ${products.length} registered`, 
                    icon: Database, 
                    color: "bg-blue-500" 
                  },
                  { 
                    label: language === 'pt' ? "Execuções de Builders" : "Studio Content Source Runs", 
                    val: "1,482", 
                    total: language === 'pt' ? "Sessões ativas este mês" : "Run sessions this month", 
                    icon: Zap, 
                    color: "bg-amber-500" 
                  },
                  { 
                    label: language === 'pt' ? "Receita Comercial Est." : "Commercial Revenue (Est)", 
                    val: "$28,490", 
                    total: language === 'pt' ? "Integrações Stripe & Gumroad" : "Stripe & Gumroad live links", 
                    icon: DollarSign, 
                    color: "bg-emerald-500" 
                  },
                  { 
                    label: language === 'pt' ? "Mecanismos de Criação" : "Integration Builders", 
                    val: language === 'pt' ? "5 Ativos" : "5 Active", 
                    total: language === 'pt' ? "Motores integrados" : "1 Labs engine configured", 
                    icon: Grid, 
                    color: "bg-purple-500" 
                  },
                ].map((st, i) => {
                  const Icon = st.icon;
                  return (
                    <div key={i} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{st.label}</span>
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white ${st.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                      </div>
                      <p className="text-2xl font-extrabold text-slate-900 mt-2">{st.val}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">{st.total}</p>
                    </div>
                  );
                })}
              </div>

              {/* Main Charts block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Chart 1: Import trends */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-8 flex flex-col h-[320px]">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Operational Content Import History</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Track daily checklist, planner, and calculator conversions into published BGrowth products.</p>
                  </div>
                  <div className="flex-1 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={RECENT_IMPORTS}>
                        <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1061EC" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#1061EC" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="total" stroke="#1061EC" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" name="Imported Blueprints" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart 2: Builder Breakdown pie */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:col-span-4 flex flex-col h-[320px]">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Builder Production Shares</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Fraction of commercial products created by each underlying creator factory tool.</p>
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-center mt-4">
                    <div className="h-32 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={BUILDER_BREAKDOWN}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={55}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {BUILDER_BREAKDOWN.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-bold w-full">
                      {BUILDER_BREAKDOWN.map((entry, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-slate-500 truncate">{entry.name} ({entry.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom block: Recent import log */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Synchronized Builder Integration Activity Log</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time callbacks showing templates drafted in builders and pulled into the Product Engine.</p>
                  </div>
                  <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[10px] font-bold text-blue-600 animate-pulse">● Live Listeners Online</span>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 pl-2">Source Builder</th>
                        <th className="pb-3">Template Name</th>
                        <th className="pb-3">Integration Status</th>
                        <th className="pb-3 pr-2 text-right">Captured Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                      {INTEGRATIONS_LOG.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50">
                          <td className="py-3 pl-2 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="font-bold text-slate-800">{log.builder}</span>
                          </td>
                          <td className="py-3">{log.template}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              log.status.includes('Success') 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3 pr-2 text-right text-slate-400 text-[11px] font-semibold">{log.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ===============================================================
              VIEW 2: CENTRAL PRODUCT ENGINE (Master Panel List-Detail)
              =============================================================== */}
          {activeTab === 'product-engine' && (
            <div className="h-full flex divide-x divide-slate-200">
               
              {/* LEFT PANEL: PRODUCT LIBRARY */}
              <div className={`w-full lg:w-80 flex flex-col bg-white h-full shrink-0 ${
                showMobileDetails ? 'hidden lg:flex' : 'flex'
              }`}>
                 
                {/* Search & Filter tools */}
                <div className="p-4 border-b border-slate-100 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search active products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs placeholder-slate-400 text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <div className="flex-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Type Filter</label>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full bg-slate-50 text-slate-600 border border-slate-200 rounded-lg py-1.5 px-2 text-xs focus:outline-none focus:border-blue-500 mt-1 font-semibold"
                      >
                        <option value="All">All Types</option>
                        <option value="Workspace">Workspace</option>
                        <option value="Planner">Planner</option>
                        <option value="Calculator">Calculator</option>
                        <option value="Template">Template</option>
                        <option value="Course">Course</option>
                        <option value="Bundle">Bundle</option>
                        <option value="Membership">Membership</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Status Tabs filters */}
                <div className="flex border-b border-slate-100 p-1 bg-slate-50">
                  {['All', 'Draft', 'Published', 'Archived'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st as any)}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                        statusFilter === st 
                          ? 'bg-white text-slate-800 shadow-sm' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Scrolling Product Library Cards List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 space-y-2">
                      <AlertCircle className="h-6 w-6 text-slate-300 mx-auto" />
                      <p className="text-xs font-semibold">No products match your current filters.</p>
                    </div>
                  ) : (
                    filteredProducts.map((p) => {
                      const isSelected = p.id === selectedProductId;
                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedProductId(p.id);
                            setShowMobileDetails(true);
                          }}
                          className={`p-4 text-left transition-all cursor-pointer border-l-4 group relative ${
                            isSelected 
                              ? 'bg-blue-50/50 border-blue-600' 
                              : 'border-transparent hover:bg-slate-50/70'
                          }`}
                        >
                          <div className="flex gap-3">
                            <img
                              src={p.thumbnail}
                              alt={p.name}
                              className="h-11 w-11 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide truncate">{p.type}</span>
                                <span className={`inline-block px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                                  p.status === 'Published' 
                                    ? 'bg-emerald-50 text-emerald-700' 
                                    : p.status === 'Draft' 
                                    ? 'bg-amber-50 text-amber-700' 
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {p.status}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors mt-0.5">{p.name}</h4>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-1">
                                <span className="text-slate-900">${p.price.toFixed(2)}</span>
                                <span>v{p.version}</span>
                                <span>{p.lastUpdated}</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick delete button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(p.id);
                            }}
                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 p-1 rounded-md transition-all hover:bg-red-50"
                            title="Delete product"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT PANEL: PRODUCT DETAILS */}
              <div className={`flex-1 flex flex-col bg-white h-full relative overflow-hidden ${
                showMobileDetails ? 'flex' : 'hidden lg:flex'
              }`}>
                 
                {activeProduct ? (
                  <>
                    {/* Selected Active Product Top Row Banner */}
                    <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4 shrink-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Back to product list button on Mobile */}
                          <button
                            type="button"
                            onClick={() => setShowMobileDetails(false)}
                            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none flex items-center justify-center border border-slate-200 bg-white"
                            title="Back to products list"
                          >
                            <ChevronRight className="h-4 w-4 rotate-180" />
                          </button>

                          <div className="flex items-center gap-4 min-w-0">
                            <div className="h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-xl border border-slate-200 shadow-sm shrink-0">
                              <img
                                src={formThumbnail || activeProduct.thumbnail}
                                alt={activeProduct.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase bg-slate-200 text-slate-600 px-2 py-0.5 rounded tracking-wide">{activeProduct.type}</span>
                                <span className="text-xs font-bold text-slate-400">Version {activeProduct.version}</span>
                              </div>
                              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1 truncate">{activeProduct.name}</h2>
                              <p className="text-xs text-slate-400 truncate">Content Source: <span className="font-bold text-slate-600">{activeProduct.contentSource.builderType}</span></p>
                            </div>
                          </div>
                        </div>

                        {/* Sticky action control panel */}
                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                        
                        <button
                          type="button"
                          onClick={() => setIsPreviewModalOpen(true)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white shadow-sm"
                        >
                          <Eye className="h-4 w-4 text-slate-400" />
                          <span>Preview Product Page</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDuplicateProduct}
                          title="Duplicate current configuration template"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 bg-white"
                        >
                          <Copy className="h-4 w-4" />
                        </button>

                        <select
                          value={activeProduct.status}
                          onChange={(e) => handleUpdateStatus(e.target.value as any)}
                          className="bg-white border border-slate-200 rounded-lg text-xs font-bold py-1.5 px-3 focus:outline-none"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Published">Published</option>
                          <option value="Archived">Archived</option>
                        </select>

                        <button
                          type="button"
                          onClick={handleSaveProductDetails}
                          className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-1.5 text-xs font-bold text-white shadow-sm"
                        >
                          <span>Save Changes</span>
                        </button>

                      </div>
                    </div>
                  </div>

                    {/* Sub Tab selection */}
                    <div className="flex border-b border-slate-150 px-6 bg-white overflow-x-auto shrink-0">
                      {(['General', 'Content Source', 'Media', 'Commerce', 'SEO', 'Publishing'] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setDetailsTab(tab)}
                          className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all shrink-0 ${
                            detailsTab === tab 
                              ? 'border-blue-600 text-blue-600' 
                              : 'border-transparent text-slate-400 hover:text-slate-700'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab Fields Content scrollbox */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                      
                      {/* 1. GENERAL TAB */}
                      {detailsTab === 'General' && (
                        <div className="space-y-6 max-w-3xl">
                          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Core Naming & Route</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Product Name</label>
                                <input
                                  type="text"
                                  value={formName}
                                  onChange={(e) => setFormName(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-500"
                                  placeholder="e.g. Legal Mobile Notary Playbook"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Product URL Slug</label>
                                <input
                                  type="text"
                                  value={formSlug}
                                  onChange={(e) => setFormSlug(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-500"
                                  placeholder="e.g. legal-mobile-notary"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Marketplace Copywriting</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Short One-Line Description</label>
                                <input
                                  type="text"
                                  value={formShortDesc}
                                  onChange={(e) => setFormShortDesc(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-500"
                                  placeholder="High-conversion subtitle for BGrowth library search."
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Commercial Sales Copy</label>
                                <textarea
                                  rows={5}
                                  value={formCommDesc}
                                  onChange={(e) => setFormCommDesc(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-500 leading-relaxed resize-y"
                                  placeholder="Write a high converting product explanation detailing core values, targets, and expected ROI milestones."
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Classifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Product Category</label>
                                <input
                                  type="text"
                                  value={formCategory}
                                  onChange={(e) => setFormCategory(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Target Industry</label>
                                <input
                                  type="text"
                                  value={formIndustry}
                                  onChange={(e) => setFormIndustry(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Operational Difficulty</label>
                                <select
                                  value={formDifficulty}
                                  onChange={(e) => setFormDifficulty(e.target.value as any)}
                                  className="mt-1.5 w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                                >
                                  <option value="Beginner">Beginner (No background required)</option>
                                  <option value="Intermediate">Intermediate (Business core set)</option>
                                  <option value="Expert">Expert (Complex legal/dilutive models)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Estimated Implementation Time</label>
                                <input
                                  type="text"
                                  value={formTime}
                                  onChange={(e) => setFormTime(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                                  placeholder="e.g. 2-3 Weeks roadmap"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Search Tags (Comma separated)</label>
                                <input
                                  type="text"
                                  value={formTags}
                                  onChange={(e) => setFormTags(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                                  placeholder="Notary, SOP, Compliance, Business"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. CONTENT SOURCE TAB (Read Only) */}
                      {detailsTab === 'Content Source' && (
                        <div className="space-y-6 max-w-3xl">
                          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4 text-amber-900">
                            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-xs leading-relaxed">
                              <p className="font-bold">Content Source of Truth</p>
                              <p className="mt-1 opacity-95">
                                This screen details the master builder config. All actual checklist items, form fields, and logic matrices must be designed inside their respective builders (e.g. Checklist Builder, Calculator Engine). 
                              </p>
                              <p className="mt-2 font-semibold">To make changes to content fields, open that specific builder from the left Studio Builders list.</p>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Builder Connection Mapping</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Builder Module</span>
                                <span className="mt-1 text-slate-800 block text-xs font-extrabold">{activeProduct.contentSource.builderType}</span>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Builder Engine Name</span>
                                <span className="mt-1 text-slate-800 block text-xs">{activeProduct.contentSource.builderName}</span>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Engine Deployment version</span>
                                <span className="mt-1 text-slate-800 block text-xs font-mono">{activeProduct.contentSource.builderVersion}</span>
                              </div>
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Content ID reference</span>
                                <span className="mt-1 text-slate-800 block text-xs font-mono">{activeProduct.contentSource.builderId}</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Module Structure Metrics</h3>
                            <div className="space-y-3">
                              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-500">Summary</span>
                                <span className="font-bold text-slate-800">{activeProduct.contentSource.moduleSummary}</span>
                              </div>
                              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-500">Sections count</span>
                                <span className="font-bold text-slate-800">{activeProduct.contentSource.sectionsCount} Units</span>
                              </div>
                              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                                <span className="font-semibold text-slate-500">Operational checklist nodes</span>
                                <span className="font-bold text-slate-800">{activeProduct.contentSource.itemsCount} Milestones</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. MEDIA TAB */}
                      {detailsTab === 'Media' && (
                        <div className="space-y-6 max-w-3xl">
                          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Core Media Branding</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Product Library Thumbnail Image URL</label>
                                <input
                                  type="text"
                                  value={formThumbnail}
                                  onChange={(e) => setFormThumbnail(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                                  placeholder="https://..."
                                />
                                {formThumbnail && (
                                  <div className="mt-2 h-20 w-20 overflow-hidden rounded-lg border border-slate-200">
                                    <img src={formThumbnail} alt="Thumbnail preview" className="h-full w-full object-cover" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Product page Main Hero Image URL</label>
                                <input
                                  type="text"
                                  value={formHeroImage}
                                  onChange={(e) => setFormHeroImage(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                                  placeholder="https://..."
                                />
                                {formHeroImage && (
                                  <div className="mt-2 h-20 w-32 overflow-hidden rounded-lg border border-slate-200">
                                    <img src={formHeroImage} alt="Hero preview" className="h-full w-full object-cover" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Gallery Resources</h3>
                            <div className="space-y-3">
                              {activeProduct.media?.downloads?.map((file, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-slate-400" />
                                    <div>
                                      <p className="font-bold text-slate-700">{file.name}</p>
                                      <p className="text-[10px] text-slate-400">{file.type} · {file.size}</p>
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full uppercase">Included</span>
                                </div>
                              ))}
                              {(!activeProduct.media?.downloads || activeProduct.media.downloads.length === 0) && (
                                <p className="text-xs text-slate-400">No additional PDF downloads linked to this product configuration.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 4. COMMERCE TAB */}
                      {detailsTab === 'Commerce' && (
                        <div className="space-y-6 max-w-3xl">
                          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pricing Configuration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Base Price (USD)</label>
                                <div className="mt-1.5 relative">
                                  <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">$</span>
                                  <input
                                    type="number"
                                    value={formPrice}
                                    onChange={(e) => setFormPrice(Number(e.target.value))}
                                    className="w-full rounded-lg border border-slate-200 pl-7 pr-4 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
                                    placeholder="49.00"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Gateway Payment Profile</label>
                                <select
                                  value={formPaymentProfile}
                                  onChange={(e) => setFormPaymentProfile(e.target.value)}
                                  className="mt-1.5 w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                                >
                                  <option value="Gumroad One-time Checkout">Gumroad One-time Checkout</option>
                                  <option value="Stripe Subscription Standard">Stripe Subscription Standard</option>
                                  <option value="LemonSqueezy SaaS Billing">LemonSqueezy SaaS Billing</option>
                                  <option value="BGrowth Member Access Only">BGrowth Member Access Only</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visibility & Delivery</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Product Library Visibility</label>
                                <select
                                  value={formVisibility}
                                  onChange={(e) => setFormVisibility(e.target.value as any)}
                                  className="mt-1.5 w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                                >
                                  <option value="Public">Public (Indexes on BGrowth main directory)</option>
                                  <option value="Private">Private (Only admins can view/assign)</option>
                                  <option value="Unlisted">Unlisted (Accessible only via direct URL)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Asset Distribution Channel</label>
                                <select
                                  value={formDistribution}
                                  onChange={(e) => setFormDistribution(e.target.value as any)}
                                  className="mt-1.5 w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
                                >
                                  <option value="Interactive Applet">Interactive Applet (Loads in iframe workspace)</option>
                                  <option value="Redirect Link">Redirect Link (Launches direct source URL)</option>
                                  <option value="Embed Code">Embed Code (Provides copyable layout block)</option>
                                </select>
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">Tax Classification Category</label>
                                <input
                                  type="text"
                                  value={formTaxCategory}
                                  onChange={(e) => setFormTaxCategory(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                                  placeholder="e.g. Digital Goods, SaaS Service"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 5. SEO TAB */}
                      {detailsTab === 'SEO' && (
                        <div className="space-y-6 max-w-3xl">
                          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Search Engine Optimization Tags</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">SEO Page Title</label>
                                <input
                                  type="text"
                                  value={formSeoTitle}
                                  onChange={(e) => setFormSeoTitle(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                                  placeholder="BGrowth Library SEO Title"
                                />
                                <span className="text-[10px] text-slate-400 mt-1 block">Optimal search length is 50-60 characters.</span>
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">SEO Meta Description</label>
                                <textarea
                                  rows={3}
                                  value={formSeoDesc}
                                  onChange={(e) => setFormSeoDesc(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 leading-relaxed"
                                  placeholder="Enter short Google snippet explanation of the product values."
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 uppercase">SEO Meta Keywords (Comma separated)</label>
                                <input
                                  type="text"
                                  value={formSeoKeywords}
                                  onChange={(e) => setFormSeoKeywords(e.target.value)}
                                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                                  placeholder="mobile notary, sop guides, compliance, bgrowth"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">OpenGraph Social Preview</h3>
                            <div className="border border-slate-100 rounded-xl overflow-hidden bg-white max-w-md">
                              <div className="h-40 overflow-hidden bg-slate-100">
                                <img src={formHeroImage || activeProduct.media.heroImage} alt="Social OG preview" className="h-full w-full object-cover" />
                              </div>
                              <div className="p-4 border-t border-slate-100 text-left">
                                <p className="text-[10px] text-blue-600 font-bold uppercase">bgrowth.club/products</p>
                                <p className="text-xs font-bold text-slate-800 mt-0.5">{formSeoTitle || formName}</p>
                                <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">{formSeoDesc || formShortDesc}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 6. PUBLISHING TAB */}
                      {detailsTab === 'Publishing' && (
                        <div className="space-y-6 max-w-3xl">
                          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Publishing Pipeline Verification</h3>
                            
                            <div className="space-y-3">
                              {validationChecklist.map((item) => (
                                <div key={item.id} className="flex items-center gap-3.5 p-3.5 bg-slate-50/70 border border-slate-150 rounded-xl text-xs">
                                  <div className="shrink-0">
                                    {item.status ? (
                                      <CheckCircle className="h-5 w-5 text-emerald-500 fill-emerald-50" />
                                    ) : (
                                      <AlertCircle className="h-5 w-5 text-slate-300" />
                                    )}
                                  </div>
                                  <span className={`font-semibold ${item.status ? 'text-slate-800' : 'text-slate-400'}`}>{item.text}</span>
                                  <span className={`ml-auto font-bold text-[10px] uppercase ${item.status ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {item.status ? 'Ready' : 'Pending'}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                              <div>
                                <p className="text-xs font-bold text-slate-700">Publishing Checklist Quality score</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Verification factors score: {validationScore} of {validationChecklist.length} rules.</p>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                                isPublishReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {isPublishReady ? '100% Valid' : `${Math.round((validationScore / validationChecklist.length) * 100)}% Complete`}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Publish Action Center</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus('Draft')}
                                className="flex flex-col items-center justify-center border border-slate-200 rounded-xl p-4 hover:bg-slate-50/50 bg-white"
                              >
                                <FileText className="h-5 w-5 text-slate-400 mb-1" />
                                <span className="text-xs font-bold text-slate-700">Revert to Draft</span>
                                <span className="text-[10px] text-slate-400 mt-0.5 text-center">Unlist from directories</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus('Published')}
                                disabled={!isPublishReady && activeProduct.status !== 'Published'}
                                className={`flex flex-col items-center justify-center border rounded-xl p-4 transition-all ${
                                  activeProduct.status === 'Published'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                    : isPublishReady 
                                    ? 'bg-blue-600 border-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                                }`}
                              >
                                <Globe className="h-5 w-5 mb-1 text-inherit" />
                                <span className="text-xs font-bold">Publish to Library</span>
                                <span className="text-[10px] mt-0.5 text-center text-inherit opacity-80">Visible on checkout</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus('Archived')}
                                className="flex flex-col items-center justify-center border border-slate-200 rounded-xl p-4 hover:bg-slate-50/50 bg-white"
                              >
                                <Archive className="h-5 w-5 text-slate-400 mb-1" />
                                <span className="text-xs font-bold text-slate-700">Archive product</span>
                                <span className="text-[10px] text-slate-400 mt-0.5 text-center">Freeze all runs</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <Database className="h-10 w-10 text-slate-300" />
                    <p className="text-sm font-bold">Select a BGrowth product on the library list to configure.</p>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* Studio Builders Registry removed as requested - already fully integrated into workspace tool switching */}

          {/* ===============================================================
              VIEW 4: GLOBAL ASSET LIBRARY
              =============================================================== */}
          {activeTab === 'assets' && (
            <div className="h-full overflow-y-auto p-6 space-y-6">
              
              {/* Media Library Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Image Assets Grid */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm md:col-span-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 font-sans">Global Image Library</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Asset files loaded across BGrowth products and library covers.</p>
                    </div>
                    <button className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                      <Upload className="h-3 w-3" /> Upload File
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { title: "Legal Notary Main", url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=400" },
                      { title: "Corporate SWOT Ret", url: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?w=400" },
                      { title: "Venture Financials", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400" },
                      { title: "SaaS ROI cover", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400" },
                      { title: "Agency onboarding", url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400" },
                      { title: "Office retreat", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400" },
                    ].map((img, i) => (
                      <div key={i} className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50 group relative">
                        <div className="h-28 overflow-hidden bg-slate-100 relative">
                          <img src={img.url} alt={img.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="p-2 bg-white text-[10px] font-bold text-slate-700 border-t border-slate-100 truncate">
                          {img.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* File Downloads / PDF links list */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm md:col-span-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 font-sans">SOP & PDF Guide Documents</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Centralized download archives packaged with checklist items.</p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { name: "Executive_SWOT_Framework.pdf", size: "3.2 MB", type: "PDF Slide Deck" },
                      { name: "Notary_Client_Intake_SOP.pdf", size: "1.4 MB", type: "PDF Guide" },
                      { name: "VC_Ready_Cap_Table_Standard.xlsx", size: "2.1 MB", type: "Template" },
                      { name: "Mileage_Faturamento_Model.xlsx", size: "420 KB", type: "Spreadsheet" },
                    ].map((doc, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-700 truncate">{doc.name}</p>
                            <p className="text-[10px] text-slate-400">{doc.size} · {doc.type}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ===============================================================
              VIEW 5: SETTINGS
              =============================================================== */}
          {activeTab === 'settings' && (
            <div className="h-full overflow-y-auto p-6 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm max-w-3xl space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Product Engine Integration Endpoints</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Define master API integrations, webhooks, and secure callback secrets for Google Sheets database syncing.</p>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Google Sheets Callback URL</label>
                      <input
                        type="text"
                        readOnly
                        value="https://script.google.com/macros/s/AKfycby-BGrowthStudio-SyncEndpoint"
                        className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono bg-slate-50 text-slate-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase">Stripe API Webhook Secret</label>
                      <input
                        type="password"
                        readOnly
                        value="whsec_bgrowth_standard_stripe_callback_verification_secret"
                        className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono bg-slate-50 text-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Database Synchronization Mode</label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl">
                        <span className="font-extrabold text-blue-700 block">Real-time Sheets Sync</span>
                        <span className="font-medium text-slate-500 text-[10px] mt-0.5 block">Every transaction and draft instantly updates registered worksheets.</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl opacity-60">
                        <span className="font-bold text-slate-700 block">Manual Batch Sync</span>
                        <span className="font-medium text-slate-500 text-[10px] mt-0.5 block">Trigger batch synchronizations manually from the console logs.</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase">Automatic Publishing Safeguards</label>
                    <label className="flex items-center gap-3 mt-2.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-blue-600" />
                      <span className="text-xs font-semibold text-slate-600">Enforce 100% score on the Publishing verification checklist prior to going Live.</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs font-bold shadow-sm">
                    Save Connections Settings
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* ===================================================================
          MODAL: RECOVER OR CREATE (IMPORT RAW CONTENT)
          =================================================================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Import Operational Content Blueprint</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Integrate items directly from BGrowth Builder instances.</p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Select Source Builder Type</label>
                <select
                  value={importSelectedBuilder}
                  onChange={(e) => setImportSelectedBuilder(e.target.value)}
                  className="mt-1.5 w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="Checklist Builder">Checklist Builder (Workspaces)</option>
                  <option value="Planner Engine">Planner Engine (Planners)</option>
                  <option value="Calculator Engine">Calculator Engine (Calculators)</option>
                  <option value="Worksheet Engine">Worksheet Engine (SWOT / Boards)</option>
                  <option value="Universal Builder">Universal Builder Engine (Labs)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 tracking-wide uppercase">Commercial Title</label>
                <input
                  type="text"
                  value={importName}
                  onChange={(e) => setImportName(e.target.value)}
                  placeholder="e.g. Roof Inspection Checklist Standard"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 tracking-wide uppercase">Commercial Price ($ USD)</label>
                <input
                  type="number"
                  value={importPrice}
                  onChange={(e) => setImportPrice(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="rounded-xl border border-slate-200 hover:bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportContent}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/10"
              >
                Sync & Import Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          HIGH FIDELITY PREVIEW MODAL (The BGrowth Website Product Page Mockup)
          =================================================================== */}
      {isPreviewModalOpen && activeProduct && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-md overflow-y-auto">
          
          {/* Modal Header bar */}
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                <Eye className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold">BGrowth Public Website Preview</h3>
                <p className="text-[10px] text-slate-400">Live high fidelity simulation · Customers will view exactly this structure on bgrowth.club</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors"
            >
              Close Preview
            </button>
          </div>

          {/* Interactive BGrowth Website Page Container */}
          <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 space-y-8 font-sans">
            
            {/* Header / Breadcrumb navigation */}
            <div className="text-left space-y-2 text-white">
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                <span>Products</span>
                <ChevronRight className="h-3 w-3" />
                <span>{formCategory || activeProduct.category}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-slate-400">{formName || activeProduct.name}</span>
              </div>
            </div>

            {/* Main Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
              
              {/* Left Column (Core visual assets, modules and long commercial desc) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Hero block */}
                <div className="bg-[#111827] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
                  <div className="h-64 sm:h-80 w-full relative">
                    <img 
                      src={formHeroImage || activeProduct.media.heroImage} 
                      alt="Product Hero Graphic" 
                      className="h-full w-full object-cover opacity-80" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                  </div>
                  
                  <div className="p-6 sm:p-8 space-y-4 -mt-20 relative">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                        {activeProduct.type}
                      </span>
                      <span className="bg-slate-800/80 backdrop-blur-sm text-slate-300 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formTime || activeProduct.estimatedTime}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      {formName || activeProduct.name}
                    </h1>

                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                      {formShortDesc || activeProduct.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Detailed Selling Copy */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Operational Commercial Description</h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {formCommDesc || activeProduct.commercialDescription}
                  </p>
                </div>

                {/* Key Benefits / Target Values */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900">What is included in this blueprint package?</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Direct Source Synchronized Config", text: `Constructed inside the dynamic ${activeProduct.contentSource.builderType} with production-grade elements.` },
                      { title: "Interactive Workspace Engine Access", text: "Allows client staff to collaborate in real-time, register checklist inputs, and monitor progress." },
                      { title: "Complete Verification Audits", text: "A comprehensive validation list that assures complete procedural compliance on each run." },
                      { title: "Full PDF Exporter Package", text: "Clean, print-ready document summaries for notary, stakeholders, or boards." }
                    ].map((ben, i) => (
                      <div key={i} className="flex gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-slate-800">{ben.title}</h4>
                          <p className="text-[11px] text-slate-500 leading-normal">{ben.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modules & Content Source section */}
                <div className="bg-[#1E293B] text-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">Ecosystem Modules</h3>
                    <span className="text-xs font-bold text-slate-400">{activeProduct.contentSource.sectionsCount} Sections</span>
                  </div>

                  <p className="text-xs text-slate-400">
                    This interactive digital tool compiles structured procedural steps directly sourced from builder reference ID <span className="font-mono text-slate-300 font-bold">{activeProduct.contentSource.builderId}</span>.
                  </p>

                  <div className="space-y-2">
                    {[...Array(activeProduct.contentSource.sectionsCount)].map((_, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl text-xs font-semibold">
                        <span className="flex items-center gap-2">
                          <span className="bg-slate-700 text-slate-300 text-[10px] px-1.5 py-0.5 rounded font-mono">{idx + 1}</span>
                          <span>Procedural Phase Module {idx + 1}</span>
                        </span>
                        <span className="text-blue-400 text-[10px] uppercase font-bold">Synchronized</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Sticky Column (Price Purchase block & checkout parameters) */}
              <div className="lg:col-span-4 lg:sticky lg:top-4 space-y-6">
                
                {/* Purchase Card */}
                <div className="bg-white rounded-3xl border-2 border-slate-900/10 p-6 shadow-xl space-y-6">
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Investment Access</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900">${formPrice.toFixed(2)}</span>
                      <span className="text-xs font-bold text-slate-400 uppercase">USD</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 py-3.5 text-xs font-black text-white shadow-lg shadow-blue-500/20 text-center flex items-center justify-center gap-1.5"
                    >
                      <span>Get Instant Interactive Access</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <p className="text-[10px] text-slate-400 text-center font-medium leading-normal">
                      Secured billing via {formPaymentProfile}.
                    </p>
                  </div>

                  {/* Trust guarantees checklist */}
                  <div className="border-t border-slate-100 pt-4 space-y-2.5 text-[11px] font-semibold text-slate-600">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Full real-time BGrowth interactive applet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Lifetime version updates included (Current: v{activeProduct.version})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Includes {activeProduct.media?.downloads?.length || 0} downloadable reference guides</span>
                    </div>
                  </div>

                </div>

                {/* Target Industry & Category parameters */}
                <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Metadata Checklist</h4>
                  
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400 font-semibold">Category:</span>
                      <span className="font-bold text-white">{formCategory || activeProduct.category}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span className="text-slate-400 font-semibold">Target Industry:</span>
                      <span className="font-bold text-white">{formIndustry || activeProduct.industry}</span>
                    </div>
                    <div className="flex justify-between pb-1">
                      <span className="text-slate-400 font-semibold">Difficulty:</span>
                      <span className="font-bold text-white">{formDifficulty || activeProduct.difficulty}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ===================================================================
          GLOBAL FLOATING TOAST NOTIFICATION
          =================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-900 border border-slate-800 text-white px-5 py-3.5 text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}