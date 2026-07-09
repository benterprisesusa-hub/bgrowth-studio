import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Star,
  MoreVertical,
  SlidersHorizontal,
  Plus,
  Eye,
  Trash2,
  ExternalLink,
  BookOpen,
  ClipboardList,
  Calendar,
  Calculator as CalcIcon,
  FileText,
  Sparkles
} from 'lucide-react';
import { DigitalProduct, ProductType } from './types';

interface ProductLibraryViewProps {
  products: DigitalProduct[];
  onSelectProduct: (product: DigitalProduct) => void;
  onDeleteProduct: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCreateNew: () => void;
}

export default function ProductLibraryView({
  products,
  onSelectProduct,
  onDeleteProduct,
  onToggleFavorite,
  onCreateNew
}: ProductLibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Draft' | 'Published' | 'Archived' | 'Template' | 'Favorites'>('All');
  const [filterType, setFilterType] = useState<string>('All');

  // Filter criteria logic
  const filteredProducts = products.filter(p => {
    // Search
    const matchesSearch = p.structure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.structure.productType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = filterStatus === 'All' ? true :
                          filterStatus === 'Favorites' ? !!p.isFavorite :
                          p.status === filterStatus;

    // Type filter
    const matchesType = filterType === 'All' ? true : p.structure.productType === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getCategoryIcon = (type: ProductType) => {
    switch (type) {
      case 'Checklist': return ClipboardList;
      case 'Planner': return Calendar;
      case 'Calculator': return CalcIcon;
      case 'Course': return BookOpen;
      default: return FileText;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8 scrollbar-thin">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Product Library</h2>
          <span className="text-[11px] text-slate-400 font-medium">
            Manage your drafts, templates, published products, and archived bundles
          </span>
        </div>
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-100 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Product Prompt</span>
        </button>
      </div>

      {/* Filter and Search Action bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-1.5 text-xs w-full md:w-80 focus-within:ring-2 focus-within:ring-indigo-600/10 focus-within:bg-white focus-within:border-indigo-600 transition-all">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search products, types or prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent w-full focus:outline-none text-slate-700 font-semibold"
          />
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none py-1">
          {['All', 'Draft', 'Published', 'Template', 'Favorites', 'Archived'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                  : 'bg-slate-50 border border-slate-100 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Type Filter selector */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 border border-slate-100 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Checklist">Checklists</option>
            <option value="Guide">Guides</option>
            <option value="Planner">Planners</option>
            <option value="Calculator">Calculators</option>
            <option value="Course">Courses</option>
          </select>
        </div>
      </div>

      {/* Grid of Products */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700 text-sm tracking-tight">No products found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            There are no products matching your active filter criteria. Try updating your filters or creating a new prompt.
          </p>
          <button
            onClick={onCreateNew}
            className="mt-4 px-4 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 rounded-xl font-bold text-xs transition-all cursor-pointer"
          >
            Create Product with AI
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((p) => {
            const IconComponent = getCategoryIcon(p.structure.productType);
            
            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Card head */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center justify-center text-indigo-600">
                      <IconComponent className="w-4.5 h-4.5 text-indigo-600" />
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Status pill */}
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'Published' ? 'bg-emerald-50 text-emerald-700' :
                        p.status === 'Archived' ? 'bg-slate-100 text-slate-500' :
                        p.status === 'Template' ? 'bg-amber-50 text-amber-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {p.status}
                      </span>
                      
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(p.id);
                        }}
                        className={`p-1 rounded-lg hover:bg-slate-50 cursor-pointer ${
                          p.isFavorite ? 'text-amber-400' : 'text-slate-300'
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  {/* Body title & description */}
                  <h4 className="font-extrabold text-slate-800 text-xs tracking-tight truncate group-hover:text-indigo-600 transition-all">
                    {p.structure.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-0.5">
                    {p.structure.productType} • v{p.structure.version}
                  </p>
                  
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {p.structure.shortDescription}
                  </p>

                  <div className="mt-3 bg-slate-50 p-2.5 rounded-xl text-[10px] text-slate-500 leading-normal border border-slate-100/50">
                    <span className="font-bold text-slate-600">Prompt:</span> "{p.prompt.substring(0, 75)}..."
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-slate-50 pt-3 mt-4 flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span>Saves: {p.versions.length}</span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectProduct(p)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1 cursor-pointer transition-all text-[11px]"
                    >
                      <span>Workspace</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
