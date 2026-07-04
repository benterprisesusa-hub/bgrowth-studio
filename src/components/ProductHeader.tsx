import { Cloud, Printer, Download, RotateCcw, ChevronRight } from 'lucide-react';
import { SecondaryButton, PrimaryButton } from './ui/Button';

interface ProductHeaderProps {
  title: string;
  onSave: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onReset: () => void;
  isSaving?: boolean;
  isGeneratingPdf?: boolean;
}

export function ProductHeader({
  title,
  onSave,
  onPrint,
  onDownloadPdf,
  onReset,
  isSaving,
  isGeneratingPdf,
}: ProductHeaderProps) {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-navy-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <BGrowthLogo />
          <ChevronRight className="hidden h-4 w-4 shrink-0 text-navy-200 sm:block" />
          <h1 className="truncate text-[15px] font-semibold text-navy-800 sm:text-base">
            {title}
          </h1>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <SecondaryButton onClick={onSave} disabled={isSaving}>
            <Cloud className="h-4 w-4" />
            {isSaving ? 'Saving…' : 'Save'}
          </SecondaryButton>
          <SecondaryButton onClick={onPrint}>
            <Printer className="h-4 w-4" />
            Print
          </SecondaryButton>
          <PrimaryButton onClick={onDownloadPdf} disabled={isGeneratingPdf}>
            <Download className="h-4 w-4" />
            {isGeneratingPdf ? 'Preparing…' : 'Download PDF'}
          </PrimaryButton>
          <SecondaryButton onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset Form
          </SecondaryButton>
        </div>

        {/* Mobile compact buttons */}
        <div className="flex items-center gap-1.5 md:hidden">
          <button aria-label="Save" onClick={onSave} className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-100 text-navy-600 active:bg-navy-50">
            <Cloud className="h-4 w-4" />
          </button>
          <button aria-label="Download PDF" onClick={onDownloadPdf} className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white active:bg-brand-600">
            <Download className="h-4 w-4" />
          </button>
          <button aria-label="Reset form" onClick={onReset} className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-100 text-navy-600 active:bg-navy-50">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function BGrowthLogo() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <img
        src="/logo.jpg"
        alt="BGrowth Club"
        className="h-8 w-8 rounded-lg object-cover"
      />
      <span className="text-[15px] font-bold leading-none text-navy-800">
        BGrowth <span className="text-brand">Club</span>
      </span>
    </div>
  );
}
