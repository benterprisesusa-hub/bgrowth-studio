import { useState } from "react";
import {
  FileSpreadsheet,
  Search,
  Sparkles,
  TrendingUp,
  Sparkle,
  Home,
  CheckCircle2,
  DollarSign,
  Briefcase,
  ChevronRight,
  Shield,
  Activity,
  Award
} from "lucide-react";
import { CalculatorConfig } from "./calcTypes";

interface TemplatesScreenProps {
  onSelectPreset: (presetKey: string) => void;
  setCurrentTab: (tab: string) => void;
  setActiveStep: (step: number) => void;
}

export default function TemplatesScreen({
  onSelectPreset,
  setCurrentTab,
  setActiveStep,
}: TemplatesScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Finance", "Pricing", "Real Estate", "SaaS"];

  const templates = [
    {
      id: "roi",
      name: "SaaS Project ROI Calculator",
      subtitle: "Evaluate the return on investment of your business automation project",
      description: "Quickly compute initial project ROI, payback period, and total operational savings based on capital expenditures, labor costs, and revenue growth.",
      industry: "SaaS & Technology",
      category: "Finance",
      difficulty: "Intermediate",
      themeColor: "#1061EC",
      coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600",
      icon: TrendingUp,
      tags: ["ROI", "Finance", "Investment", "SaaS"],
      estimatedTime: "2-3 mins",
      isPopular: true,
    },
    {
      id: "cleaning",
      name: "Residential Cleaning Quote Calculator",
      subtitle: "Instantly estimate home and office cleaning rates",
      description: "Produce dynamic quotes based on property type, size, square footage, and custom add-ons like deep cleaning, fridge/oven details, and weekly timing schedules.",
      industry: "Home Services",
      category: "Pricing",
      difficulty: "Beginner",
      themeColor: "#1061EC",
      coverImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
      icon: Home,
      tags: ["Cleaning", "Quote", "Pricing", "Home Services"],
      estimatedTime: "1-2 mins",
      isPopular: true,
    },
    {
      id: "mortgage",
      name: "Commercial Mortgage Refinance Estimator",
      subtitle: "Analyze mortgage savings, monthly payouts, and amortizations",
      description: "Evaluate capital savings by refinancing existing commercial property mortgages. Calculates interest reductions and monthly cash flow adjustments.",
      industry: "Real Estate",
      category: "Real Estate",
      difficulty: "Advanced",
      themeColor: "#8B5CF6",
      coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=600",
      icon: Briefcase,
      tags: ["Real Estate", "Mortgage", "Finance"],
      estimatedTime: "3-4 mins",
      isPopular: false,
    },
    {
      id: "cac-ltv",
      name: "Marketing LTV & CAC Unit Economics Tracker",
      subtitle: "Calculate Customer Lifetime Value (LTV) and CAC ratio",
      description: "Ensure healthy unit economics by tracking CAC, monthly retention, average contract values, and dynamic marketing payback periods.",
      industry: "Marketing Technology",
      category: "SaaS",
      difficulty: "Intermediate",
      themeColor: "#059669",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      icon: Award,
      tags: ["SaaS", "LTV", "CAC", "Growth"],
      estimatedTime: "2 mins",
      isPopular: false,
    },
  ];

  // Filter templates based on category and search query
  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleLoadTemplate = (id: string) => {
    // Select the preset and direct the user into the active editor screen
    onSelectPreset(id === "cleaning" ? "cleaning" : "roi");
    setCurrentTab("builder");
    setActiveStep(1); // Set to Details step
  };

  return (
    <div id="templates-gallery-screen" className="space-y-6">
      {/* Upper Banner */}
      <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#0D1B4C] flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-[#1061EC]" />
            Template Gallery
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Accelerate your setup by launching from a battle-tested blueprint calculator. Fully customizable.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#1061EC]"
          />
        </div>
      </div>

      {/* Categories Horizontal Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === cat
                ? "bg-[#1061EC] text-white shadow-md shadow-blue-500/10"
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => {
          const IconComponent = template.icon;
          return (
            <div
              key={template.id}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(13,27,76,0.04)] hover:border-slate-300 transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Header Cover Image */}
                <div className="relative h-40 bg-slate-900 overflow-hidden">
                  <img
                    src={template.coverImage}
                    alt={template.name}
                    className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                  <div className="absolute top-3 left-3 flex gap-2">
                    {template.isPopular && (
                      <span className="bg-amber-400 text-slate-950 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                        <Sparkle className="h-2.5 w-2.5 fill-slate-950" />
                        Popular
                      </span>
                    )}
                    <span className="bg-slate-900/80 text-slate-200 backdrop-blur-sm text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                      {template.industry}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center text-white shrink-0" style={{ backgroundColor: template.themeColor }}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white line-clamp-1">{template.name}</h3>
                        <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">{template.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-5 space-y-3.5">
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-medium lowercase">Difficulty</span>
                      <span className="block mt-0.5 text-slate-700 font-extrabold">{template.difficulty}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-medium lowercase">Build time</span>
                      <span className="block mt-0.5 text-slate-700 font-extrabold">{template.estimatedTime}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-medium lowercase">Variables</span>
                      <span className="block mt-0.5 text-slate-700 font-extrabold">{template.id === "cleaning" ? "7 inputs" : "6 inputs"}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-slate-50 border border-slate-200/50 text-[10px] font-bold text-slate-500 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer action button */}
              <div className="px-5 pb-5 pt-1 flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold text-slate-400">
                  Ready to deploy
                </span>
                <button
                  onClick={() => handleLoadTemplate(template.id)}
                  className="px-4 py-2 bg-[#1061EC] hover:bg-[#0d50c5] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:translate-x-0.5 transition-all"
                >
                  <span>Load Blueprint</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTemplates.length === 0 && (
          <div className="col-span-2 py-16 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold text-[#0D1B4C] text-sm block">No templates found</span>
              <p className="text-xs text-slate-400 mt-1">Try tweaking your search parameters or select a different filter category.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
