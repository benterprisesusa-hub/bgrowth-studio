import { Cloud, Printer, Download, RotateCcw } from 'lucide-react';
import { SecondaryButton, PrimaryButton } from './ui/Button';

interface ProductHeaderProps {
  title: string;
  onSave: () => void;
  onPrint: () => void;
  onPrintBlank?: () => void;
  onDownloadPdf: () => void;
  onDownloadBlankPdf?: () => void;
  onReset: () => void;
  isSaving?: boolean;
  isGeneratingPdf?: boolean;
  isGeneratingBlankPdf?: boolean;
}

export function ProductHeader({
  title,
  onSave,
  onPrint,
  onPrintBlank,
  onDownloadPdf,
  onDownloadBlankPdf,
  onReset,
  isSaving,
  isGeneratingPdf,
  isGeneratingBlankPdf,
}: ProductHeaderProps) {  return (
    <header className="no-print sticky top-0 z-30 border-b border-navy-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <BGrowthLogo title={title} />
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
          {onPrintBlank && (
            <SecondaryButton onClick={onPrintBlank}>
              <Printer className="h-4 w-4" />
              Print Blank
            </SecondaryButton>
          )}
          <PrimaryButton onClick={onDownloadPdf} disabled={isGeneratingPdf}>
            <Download className="h-4 w-4" />
            {isGeneratingPdf ? 'Preparing…' : 'Download PDF'}
          </PrimaryButton>
          {onDownloadBlankPdf && (
            <SecondaryButton onClick={onDownloadBlankPdf} disabled={isGeneratingBlankPdf}>
              <Download className="h-4 w-4" />
              {isGeneratingBlankPdf ? 'Preparing…' : 'Blank PDF'}
            </SecondaryButton>
          )}          <SecondaryButton onClick={onReset}>
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
          {onDownloadBlankPdf && (
            <button aria-label="Download blank PDF" onClick={onDownloadBlankPdf} className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-100 text-navy-600 active:bg-navy-50">
              <Download className="h-4 w-4" />
            </button>
          )}
          <button aria-label="Reset form" onClick={onReset} className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-100 text-navy-600 active:bg-navy-50">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function BGrowthLogo({ title }: { title: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5">
      <img
        src="/logo.jpg"
        alt="BGrowth"
        className="h-8 w-8 rounded-lg object-cover shrink-0"
      />
      <div className="min-w-0">
        <span className="block text-[11px] font-bold leading-none tracking-widest text-brand-600 uppercase">
          BGrowth
        </span>
        <h1 className="truncate text-[13px] font-semibold leading-snug text-navy-800 max-w-[200px] sm:max-w-none sm:text-[15px]">
          {title}
        </h1>
      </div>
    </div>
  );
}
