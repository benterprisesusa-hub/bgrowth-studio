import { useState, useEffect } from 'react';
import AIBuilderSidebar from './AIBuilderSidebar';
import AIBuilderHeader from './AIBuilderHeader';
import CreatePage from './CreatePage';
import ProductDashboardView from './ProductDashboardView';
import ProductLibraryView from './ProductLibraryView';
import DashboardOverview from './DashboardOverview';
import AnalyticsView from './AnalyticsView';
import SettingsView from './SettingsView';
import { DigitalProduct, AICreditCost } from './types';

const SEEDED_PRODUCTS: DigitalProduct[] = [];

interface AIBuilderProps {
  ownerEmail?: string;
}

export function AIBuilder({ ownerEmail: _ }: AIBuilderProps) {
  const [currentTab, setCurrentTab] = useState<string>('create');
  const [activeProduct, setActiveProduct] = useState<DigitalProduct | null>(null);
  const [credits, setCredits] = useState<number>(12450);

  const [creditCosts, setCreditCosts] = useState<AICreditCost[]>([
    { action: 'Initial Product Generation', cost: 150 },
    { action: 'SEO Strategy Audit', cost: 30 },
    { action: 'Full Language Translation', cost: 50 },
    { action: 'Aesthetic Layout Adjustments', cost: 40 },
  ]);

  const [products, setProducts] = useState<DigitalProduct[]>(() => {
    const saved = localStorage.getItem('bgrowth_studio_products_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed)
          ? parsed.filter((p: any) => !p.id.startsWith('seed_'))
          : SEEDED_PRODUCTS;
      } catch { return SEEDED_PRODUCTS; }
    }
    return SEEDED_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('bgrowth_studio_products_v3', JSON.stringify(products));
  }, [products]);

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateProduct = async (prompt: string, productType?: string, blueprint?: any) => {
    setIsGenerating(true);
    const generationCost = creditCosts.find(c => c.action === 'Initial Product Generation')?.cost || 150;
    setCredits(prev => Math.max(0, prev - generationCost));

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, productType, blueprint }),
      });
      const data = await response.json();
      if (data.product) {
        setProducts(prev => [data.product, ...prev]);
        setActiveProduct(data.product);
        setCurrentTab('product-dashboard');
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateProduct = (updated: DigitalProduct) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setActiveProduct(updated);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    if (activeProduct?.id === id) {
      setActiveProduct(null);
      setCurrentTab('create');
    }
  };

  const handleSelectProduct = (product: DigitalProduct) => {
    setActiveProduct(product);
    setCurrentTab('product-dashboard');
  };

  const handleImproveProduct = async (product: DigitalProduct, instruction: string) => {
    try {
      const response = await fetch('/api/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, instruction }),
      });
      const data = await response.json();
      if (data.product) handleUpdateProduct(data.product);
    } catch (error) {
      console.error('Improve error:', error);
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-slate-50 font-sans">
      <AIBuilderSidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        products={products}
        credits={credits}
        onSelectProduct={handleSelectProduct}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AIBuilderHeader currentTab={currentTab} />

        <main className="flex-1 overflow-hidden">
          {currentTab === 'create' && (
            <CreatePage
              onGenerate={handleGenerateProduct}
              isGenerating={isGenerating}
              products={products}
              onSelectProduct={handleSelectProduct}
            />
          )}
          {currentTab === 'dashboard' && (
            <DashboardOverview
              products={products}
              credits={credits}
              onTabChange={setCurrentTab}
              onSelectProduct={handleSelectProduct}
            />
          )}
          {currentTab === 'products' && (
            <ProductLibraryView
              products={products}
              onSelectProduct={handleSelectProduct}
              onDeleteProduct={handleDeleteProduct}
              onTabChange={setCurrentTab}
            />
          )}
          {currentTab === 'product-dashboard' && activeProduct && (
            <ProductDashboardView
              product={activeProduct}
              onUpdate={handleUpdateProduct}
              onDelete={handleDeleteProduct}
              onImprove={handleImproveProduct}
              onBack={() => setCurrentTab('products')}
            />
          )}
          {currentTab === 'analytics' && (
            <AnalyticsView products={products} />
          )}
          {currentTab === 'settings' && (
            <SettingsView
              creditCosts={creditCosts}
              onUpdateCreditCosts={setCreditCosts}
            />
          )}
        </main>
      </div>
    </div>
  );
}
